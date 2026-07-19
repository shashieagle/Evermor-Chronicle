import { useState, useEffect, useCallback, useRef } from "react";
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, sortableKeyboardCoordinates, rectSortingStrategy,
  useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
const API  = `${BASE}/api`;

// ── Types ─────────────────────────────────────────────────────────────────────
interface StoryRow {
  slug: string; title: string; couple: string; location: string;
  heroImage: string; hasFilm: boolean; videoUrl: string | null;
  narrative: string | null; pause: string | null; reflection: string | null;
}
interface Photo { id: number; url: string; objectPath: string | null; position: number; }

// ── Helpers ───────────────────────────────────────────────────────────────────
function apiHeaders(token: string) {
  return { "Content-Type": "application/json", "X-Admin-Token": token };
}

function embedUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    // YouTube
    const ytId = u.searchParams.get("v") ||
      (u.hostname === "youtu.be" ? u.pathname.slice(1) : null);
    if (ytId) return `https://www.youtube.com/embed/${ytId}`;
    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return raw; // pass through if already embed URL or unknown
  } catch { return null; }
}

// ── Sortable photo tile ───────────────────────────────────────────────────────
function SortablePhoto({ photo, onDelete }: { photo: Photo; onDelete: (id: number) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: photo.id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform), transition,
        opacity: isDragging ? 0.5 : 1, position: "relative", cursor: "grab",
      }}
    >
      <img
        src={photo.url}
        alt=""
        style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block", borderRadius: 2 }}
        {...attributes} {...listeners}
      />
      <button
        onClick={() => onDelete(photo.id)}
        onPointerDown={e => e.stopPropagation()}
        style={{
          position: "absolute", top: 6, right: 6,
          width: 24, height: 24, borderRadius: "50%",
          border: "none", background: "rgba(0,0,0,0.55)", color: "#fff",
          fontSize: 14, lineHeight: 1, cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
        }}
        title="Remove photo"
      >×</button>
    </div>
  );
}

// ── Main admin page ───────────────────────────────────────────────────────────
export default function Admin() {
  const [token, setToken]         = useState(() => localStorage.getItem("evermor_admin") || "");
  const [authed, setAuthed]       = useState(false);
  const [authError, setAuthError] = useState("");
  const [pwInput, setPwInput]     = useState("");

  const [stories, setStories]     = useState<StoryRow[]>([]);
  const [selected, setSelected]   = useState<string | null>(null);
  const [story, setStory]         = useState<StoryRow | null>(null);
  const [photos, setPhotos]       = useState<Photo[]>([]);

  // Form fields
  const [form, setForm] = useState({
    title: "", couple: "", location: "",
    narrative: "", pause: "", reflection: "",
    videoUrl: "", hasFilm: false,
  });

  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // ── Auth ───────────────────────────────────────────────────────────────────
  const verify = useCallback(async (t: string) => {
    try {
      const r = await fetch(`${API}/admin/verify`, {
        method: "POST", headers: apiHeaders(t),
      });
      if (r.ok) {
        localStorage.setItem("evermor_admin", t);
        setToken(t); setAuthed(true); setAuthError("");
      } else {
        setAuthError("Incorrect password");
      }
    } catch { setAuthError("Could not connect to server"); }
  }, []);

  useEffect(() => { if (token) verify(token); }, []);

  // ── Load stories list ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!authed) return;
    fetch(`${API}/admin/stories`, { headers: { "X-Admin-Token": token } })
      .then(r => r.json())
      .then(d => { setStories(d.stories || []); if (d.stories?.length) setSelected(d.stories[0].slug); })
      .catch(() => {});
  }, [authed]);

  // ── Load selected story ────────────────────────────────────────────────────
  useEffect(() => {
    if (!selected || !authed) return;
    fetch(`${API}/admin/stories/${selected}`, { headers: { "X-Admin-Token": token } })
      .then(r => r.json())
      .then(d => {
        setStory(d.story);
        setPhotos(d.photos || []);
        setForm({
          title:      d.story.title      || "",
          couple:     d.story.couple     || "",
          location:   d.story.location   || "",
          narrative:  d.story.narrative  || "",
          pause:      d.story.pause      || "",
          reflection: d.story.reflection || "",
          videoUrl:   d.story.videoUrl   || "",
          hasFilm:    d.story.hasFilm    ?? false,
        });
      })
      .catch(() => {});
  }, [selected, authed]);

  // ── Save ───────────────────────────────────────────────────────────────────
  const save = async () => {
    if (!selected) return;
    setSaving(true); setSaveMsg("");
    try {
      const r = await fetch(`${API}/admin/stories/${selected}`, {
        method: "PUT", headers: apiHeaders(token),
        body: JSON.stringify(form),
      });
      setSaveMsg(r.ok ? "Saved ✓" : "Error saving");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch { setSaveMsg("Error saving"); }
    setSaving(false);
  };

  // ── Upload photos ──────────────────────────────────────────────────────────
  const uploadFiles = async (files: FileList) => {
    if (!selected || files.length === 0) return;
    setUploading(true);
    const nextPos = photos.length;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // 1. Get presigned URL
        const urlRes = await fetch(`${API}/admin/photos/request-url`, {
          method: "POST", headers: apiHeaders(token),
        });
        const { uploadURL, objectPath } = await urlRes.json();
        // 2. PUT file to GCS
        await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        // 3. Save to DB
        const saveRes = await fetch(`${API}/admin/stories/${selected}/photos`, {
          method: "POST", headers: apiHeaders(token),
          body: JSON.stringify({ objectPath, position: nextPos + i }),
        });
        const { photo } = await saveRes.json();
        setPhotos(prev => [...prev, photo]);
      } catch (e) { console.error("Upload failed:", e); }
    }
    setUploading(false);
  };

  // ── Drag end ───────────────────────────────────────────────────────────────
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = photos.findIndex(p => p.id === active.id);
    const newIdx = photos.findIndex(p => p.id === over.id);
    const reordered = arrayMove(photos, oldIdx, newIdx);
    setPhotos(reordered);
    await fetch(`${API}/admin/stories/${selected}/photos/reorder`, {
      method: "PUT", headers: apiHeaders(token),
      body: JSON.stringify({ ids: reordered.map(p => p.id) }),
    }).catch(() => {});
  };

  // ── Delete photo ───────────────────────────────────────────────────────────
  const deletePhoto = async (id: number) => {
    await fetch(`${API}/admin/photos/${id}`, { method: "DELETE", headers: { "X-Admin-Token": token } });
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  // ── Styles ─────────────────────────────────────────────────────────────────
  const bg   = "#F5F0E8";
  const ink  = "#3A342C";
  const mid  = "#EAE3D3";
  const line = `1px solid ${ink}18`;
  const serif = { fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif" };
  const sans  = { fontFamily: "'Inter',sans-serif" };
  const label = { ...sans, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: `${ink}70`, display: "block", marginBottom: 6 };
  const input = { ...sans, fontSize: 14, color: ink, background: "transparent", border: line, borderRadius: 2, padding: "8px 12px", width: "100%", outline: "none", boxSizing: "border-box" as const };
  const textarea = { ...input, resize: "vertical" as const, minHeight: 100, lineHeight: 1.7 };

  // ── Login screen ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 360, padding: 48 }}>
          <h1 style={{ ...serif, fontSize: 32, fontWeight: 300, color: ink, margin: "0 0 8px" }}>Evermor</h1>
          <p style={{ ...sans, fontSize: 12, color: `${ink}55`, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 40 }}>Admin</p>
          <label style={label}>Password</label>
          <input
            type="password"
            value={pwInput}
            onChange={e => setPwInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && verify(pwInput)}
            style={{ ...input, marginBottom: 16 }}
            autoFocus
          />
          {authError && <p style={{ ...sans, fontSize: 12, color: "#c0392b", marginBottom: 12 }}>{authError}</p>}
          <button
            onClick={() => verify(pwInput)}
            style={{ ...sans, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: bg, background: ink, border: "none", padding: "12px 32px", cursor: "pointer", width: "100%" }}
          >Enter</button>
        </div>
      </div>
    );
  }

  const embed = form.videoUrl ? embedUrl(form.videoUrl) : null;

  // ── Admin panel ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: bg, color: ink, display: "flex", ...sans }}>

      {/* Sidebar */}
      <aside style={{ width: 240, borderRight: line, padding: "32px 0", flexShrink: 0, overflowY: "auto" }}>
        <div style={{ padding: "0 24px 24px", borderBottom: line }}>
          <p style={{ ...serif, fontSize: 20, fontWeight: 300, margin: 0 }}>Evermor</p>
          <p style={{ fontSize: 11, color: `${ink}55`, letterSpacing: "0.18em", textTransform: "uppercase", margin: "4px 0 0" }}>Admin</p>
        </div>
        <div style={{ padding: "16px 0" }}>
          <p style={{ ...label, padding: "0 24px", marginBottom: 8 }}>Stories</p>
          {stories.map(s => (
            <button
              key={s.slug}
              onClick={() => setSelected(s.slug)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "10px 24px", border: "none", cursor: "pointer",
                background: selected === s.slug ? mid : "transparent",
                borderLeft: selected === s.slug ? `2px solid ${ink}` : "2px solid transparent",
                color: ink, fontSize: 13,
              }}
            >
              <div style={{ fontWeight: selected === s.slug ? 500 : 400 }}>{s.couple}</div>
              <div style={{ fontSize: 11, color: `${ink}55`, marginTop: 2 }}>{s.location}</div>
            </button>
          ))}
        </div>
        <div style={{ padding: "16px 24px", borderTop: line }}>
          <button
            onClick={() => { localStorage.removeItem("evermor_admin"); setAuthed(false); setToken(""); }}
            style={{ ...sans, fontSize: 11, color: `${ink}50`, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: "auto", padding: "40px 56px" }}>
        {!story ? (
          <p style={{ color: `${ink}40`, fontSize: 14 }}>Select a story</p>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40 }}>
              <div>
                <h2 style={{ ...serif, fontSize: 28, fontWeight: 300, margin: "0 0 4px" }}>{story.couple}</h2>
                <p style={{ fontSize: 12, color: `${ink}55`, letterSpacing: "0.18em", textTransform: "uppercase", margin: 0 }}>{story.location}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {saveMsg && <span style={{ fontSize: 12, color: saveMsg.includes("✓") ? "#2e7d32" : "#c0392b" }}>{saveMsg}</span>}
                <button
                  onClick={save} disabled={saving}
                  style={{ ...sans, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: bg, background: ink, border: "none", padding: "10px 28px", cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1 }}
                >{saving ? "Saving…" : "Save"}</button>
              </div>
            </div>

            {/* ── Photos ─────────────────────────────────────────────── */}
            <section style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <p style={label}>Photos <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: "none" }}>— drag to reorder</span></p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    ref={fileRef} type="file" accept="image/*" multiple
                    style={{ display: "none" }}
                    onChange={e => e.target.files && uploadFiles(e.target.files)}
                  />
                  <button
                    onClick={() => fileRef.current?.click()} disabled={uploading}
                    style={{ ...sans, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: ink, background: "transparent", border: line, padding: "8px 20px", cursor: "pointer", opacity: uploading ? 0.6 : 1 }}
                  >{uploading ? "Uploading…" : "+ Upload photos"}</button>
                </div>
              </div>

              {photos.length === 0 ? (
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{ border: `1px dashed ${ink}30`, borderRadius: 4, padding: "48px 32px", textAlign: "center", cursor: "pointer", color: `${ink}45`, fontSize: 13 }}
                >
                  Click to upload photos, or drag them after uploading
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={photos.map(p => p.id)} strategy={rectSortingStrategy}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
                      {photos.map(p => (
                        <SortablePhoto key={p.id} photo={p} onDelete={deletePhoto} />
                      ))}
                      {/* Upload tile */}
                      <div
                        onClick={() => fileRef.current?.click()}
                        style={{ border: `1px dashed ${ink}25`, borderRadius: 2, aspectRatio: "3/4", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: `${ink}40`, fontSize: 22 }}
                      >+</div>
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </section>

            {/* ── Details ────────────────────────────────────────────── */}
            <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 40 }}>
              <div>
                <label style={label}>Story title</label>
                <input style={input} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label style={label}>Couple</label>
                <input style={input} value={form.couple} onChange={e => setForm(f => ({ ...f, couple: e.target.value }))} />
              </div>
              <div>
                <label style={label}>Location</label>
                <input style={input} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <label style={{ ...label, marginBottom: 12 }}>Film available</label>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                  <div
                    onClick={() => setForm(f => ({ ...f, hasFilm: !f.hasFilm }))}
                    style={{ width: 40, height: 22, borderRadius: 11, background: form.hasFilm ? ink : `${ink}25`, position: "relative", transition: "background 300ms", cursor: "pointer" }}
                  >
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: form.hasFilm ? 21 : 3, transition: "left 200ms" }} />
                  </div>
                  <span style={{ fontSize: 13, color: ink }}>{form.hasFilm ? "Yes" : "No"}</span>
                </label>
              </div>
            </section>

            <div style={{ marginBottom: 24 }}>
              <label style={label}>Narrative</label>
              <textarea style={textarea} value={form.narrative} onChange={e => setForm(f => ({ ...f, narrative: e.target.value }))} rows={5} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={label}>Pause / quote</label>
              <textarea style={textarea} value={form.pause} onChange={e => setForm(f => ({ ...f, pause: e.target.value }))} rows={3} />
            </div>
            <div style={{ marginBottom: 40 }}>
              <label style={label}>Reflection</label>
              <textarea style={textarea} value={form.reflection} onChange={e => setForm(f => ({ ...f, reflection: e.target.value }))} rows={4} />
            </div>

            {/* ── Video ──────────────────────────────────────────────── */}
            <section style={{ borderTop: line, paddingTop: 40, marginBottom: 48 }}>
              <p style={label}>Film / video embed</p>
              <p style={{ fontSize: 12, color: `${ink}55`, marginBottom: 16, lineHeight: 1.6 }}>Paste a YouTube or Vimeo URL. The film section will show an embedded player instead of "available soon".</p>
              <input
                style={{ ...input, marginBottom: embed ? 20 : 0 }}
                placeholder="https://www.youtube.com/watch?v=..."
                value={form.videoUrl}
                onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
              />
              {embed && (
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: 2 }}>
                  <iframe
                    src={embed} title="Film preview"
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
