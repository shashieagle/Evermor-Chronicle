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
  heroImage: string | null; hasFilm: boolean; videoUrl: string | null;
  filmRuntime: string | null;
  narrative: string | null; pause: string | null; reflection: string | null;
}
interface Photo { id: number; url: string; objectPath: string | null; position: number; }
interface SlideshowPhoto { id: number; url: string; objectPath: string | null; position: number; }
interface EnquiryRow {
  id: number;
  names: string;
  email: string;
  phone: string;
  location: string;
  weddingDate: string;
  venue: string | null;
  createdAt: string;
  readAt: string | null;
  archivedAt: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function apiHeaders(token: string) {
  return { "Content-Type": "application/json", "X-Admin-Token": token };
}

function embedUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    const ytId = u.searchParams.get("v") ||
      (u.hostname === "youtu.be" ? u.pathname.slice(1) : null);
    if (ytId) return `https://www.youtube.com/embed/${ytId}`;
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return raw;
  } catch { return null; }
}

function toSlug(couple: string) {
  return couple.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  }).format(date);
}

// ── Sortable photo tile ───────────────────────────────────────────────────────
function SortablePhoto({
  photo, onDelete, isHero, onSetHero,
}: {
  photo: Photo;
  onDelete: (id: number) => void;
  isHero: boolean;
  onSetHero: (url: string) => void;
}) {
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
      {/* Hero badge */}
      {isHero && (
        <div style={{
          position: "absolute", top: 6, left: 6,
          background: "rgba(58,52,44,0.85)", color: "#F5F0E8",
          fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase",
          padding: "3px 7px", borderRadius: 2, pointerEvents: "none",
        }}>Hero</div>
      )}
      {/* Set hero button */}
      {!isHero && (
        <button
          onClick={() => onSetHero(photo.url)}
          onPointerDown={e => e.stopPropagation()}
          title="Set as hero image"
          style={{
            position: "absolute", top: 6, left: 6,
            width: 24, height: 24, borderRadius: "50%",
            border: "none", background: "rgba(0,0,0,0.45)", color: "#fff",
            fontSize: 13, lineHeight: 1, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}
        >☆</button>
      )}
      {/* Delete button */}
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

// ── Sortable slide tile ───────────────────────────────────────────────────────
function SortableSlideTile({
  photo, onDelete,
}: {
  photo: SlideshowPhoto;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: photo.id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform), transition,
        opacity: isDragging ? 0.5 : 1, position: "relative", cursor: "grab",
      }}
      {...attributes} {...listeners}
    >
      <img
        src={photo.url} alt=""
        style={{ width: "100%", aspectRatio: "3/2", objectFit: "cover", display: "block", borderRadius: 2 }}
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
        title="Remove"
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
    videoUrl: "", filmRuntime: "", hasFilm: false,
  });

  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Slideshow state
  const [activeTab, setActiveTab]             = useState<"stories" | "slideshow" | "enquiries">("stories");
  const [slidePhotos, setSlidePhotos]         = useState<SlideshowPhoto[]>([]);
  const [slideUploading, setSlideUploading]   = useState(false);
  const slideFileRef = useRef<HTMLInputElement>(null);
  const [enquiries, setEnquiries]             = useState<EnquiryRow[]>([]);
  const [updatingEnquiryIds, setUpdatingEnquiryIds] = useState<number[]>([]);
  const [enquiryError, setEnquiryError]       = useState("");

  // New story modal
  const [showNew, setShowNew]     = useState(false);
  const [newCouple, setNewCouple] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newSlug, setNewSlug]     = useState("");
  const [creating, setCreating]   = useState(false);
  const [createError, setCreateError] = useState("");

  // Archived stories
  const [archivedStories, setArchivedStories] = useState<StoryRow[]>([]);
  const [showArchived, setShowArchived]       = useState(false);

  // Delete confirmation
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  // Sync to production
  const [syncing, setSyncing]     = useState(false);
  const [syncMsg, setSyncMsg]     = useState("");
  const [syncStatus, setSyncStatus] = useState<"success" | "warning" | "error" | "">("");

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
  const loadStories = useCallback(async () => {
    if (!authed) return;
    const r = await fetch(`${API}/admin/stories`, { headers: { "X-Admin-Token": token } });
    const d = await r.json();
    const list: StoryRow[] = d.stories || [];
    setStories(list);
    if (list.length && !selected) setSelected(list[0].slug);
  }, [authed, token]);

  useEffect(() => { loadStories(); }, [authed]);

  // ── Load slideshow photos ──────────────────────────────────────────────────
  const loadSlidePhotos = useCallback(async () => {
    if (!authed) return;
    const r = await fetch(`${API}/admin/slideshow`, { headers: { "X-Admin-Token": token } });
    const d = await r.json();
    setSlidePhotos(d.photos || []);
  }, [authed, token]);

  useEffect(() => { loadSlidePhotos(); }, [authed]);

  // ── Load enquiries ──────────────────────────────────────────────────────────
  const loadEnquiries = useCallback(async () => {
    if (!authed) return;
    try {
      const r = await fetch(`${API}/admin/enquiries`, { headers: { "X-Admin-Token": token } });
      if (!r.ok) return;
      const d = await r.json();
      setEnquiries(d.enquiries || []);
    } catch {}
  }, [authed, token]);

  useEffect(() => { loadEnquiries(); }, [authed]);

  // ── Mark enquiry read/unread or archive/restore ─────────────────────────────
  const updateEnquiry = async (id: number, changes: { read?: boolean; archived?: boolean }) => {
    if (updatingEnquiryIds.includes(id)) return;
    setUpdatingEnquiryIds(prev => [...prev, id]);
    setEnquiryError("");
    try {
      const r = await fetch(`${API}/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: apiHeaders(token),
        body: JSON.stringify(changes),
      });
      if (!r.ok) {
        setEnquiryError("Could not update the enquiry. Please try again.");
        return;
      }
      const d = await r.json();
      if (d.enquiry) {
        setEnquiries(prev => prev.map(enquiry => enquiry.id === id ? d.enquiry : enquiry));
      }
    } catch {
      setEnquiryError("Could not update the enquiry. Please try again.");
    } finally {
      setUpdatingEnquiryIds(prev => prev.filter(enquiryId => enquiryId !== id));
    }
  };

  // ── Load archived stories ──────────────────────────────────────────────────
  const loadArchivedStories = useCallback(async () => {
    if (!authed) return;
    const r = await fetch(`${API}/admin/stories-archived`, { headers: { "X-Admin-Token": token } });
    const d = await r.json();
    setArchivedStories(d.stories || []);
  }, [authed, token]);

  useEffect(() => { loadArchivedStories(); }, [authed]);

  // ── Upload slideshow photos ────────────────────────────────────────────────
  const uploadSlideFiles = async (files: FileList) => {
    if (files.length === 0) return;
    setSlideUploading(true);
    const nextPos = slidePhotos.length;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const urlRes = await fetch(`${API}/admin/photos/request-url`, { method: "POST", headers: apiHeaders(token) });
        const { uploadURL, objectPath } = await urlRes.json();
        await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
        const saveRes = await fetch(`${API}/admin/slideshow`, {
          method: "POST", headers: apiHeaders(token),
          body: JSON.stringify({ objectPath, position: nextPos + i }),
        });
        const { photo } = await saveRes.json();
        setSlidePhotos(prev => [...prev, photo]);
      } catch (e) { console.error("Slide upload failed:", e); }
    }
    setSlideUploading(false);
  };

  // ── Delete slideshow photo ─────────────────────────────────────────────────
  const deleteSlidePhoto = async (id: number) => {
    await fetch(`${API}/admin/slideshow/${id}`, { method: "DELETE", headers: { "X-Admin-Token": token } });
    setSlidePhotos(prev => prev.filter(p => p.id !== id));
  };

  // ── Reorder slideshow photos ───────────────────────────────────────────────
  const handleSlideDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = slidePhotos.findIndex(p => p.id === active.id);
    const newIdx = slidePhotos.findIndex(p => p.id === over.id);
    const reordered = arrayMove(slidePhotos, oldIdx, newIdx);
    setSlidePhotos(reordered);
    await fetch(`${API}/admin/slideshow/reorder`, {
      method: "PUT", headers: apiHeaders(token),
      body: JSON.stringify({ ids: reordered.map(p => p.id) }),
    }).catch(() => {});
  };

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
          videoUrl:    d.story.videoUrl    || "",
          filmRuntime: d.story.filmRuntime || "",
          hasFilm:     d.story.hasFilm    ?? false,
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

  // ── Create story ───────────────────────────────────────────────────────────
  const createStory = async () => {
    if (!newCouple.trim()) return;
    setCreating(true); setCreateError("");
    const slug = newSlug || toSlug(newCouple);
    try {
      const r = await fetch(`${API}/admin/stories`, {
        method: "POST", headers: apiHeaders(token),
        body: JSON.stringify({ slug, couple: newCouple, location: newLocation }),
      });
      const d = await r.json();
      if (!r.ok) { setCreateError(d.error || "Failed to create"); setCreating(false); return; }
      setStories(prev => [...prev, d.story]);
      setSelected(d.story.slug);
      setShowNew(false); setNewCouple(""); setNewLocation(""); setNewSlug("");
    } catch { setCreateError("Could not connect to server"); }
    setCreating(false);
  };

  // ── Sync to production ─────────────────────────────────────────────────────
  const syncToProduction = async () => {
    setSyncing(true); setSyncMsg(""); setSyncStatus("");
    try {
      // Step 1: write the snapshot to object storage
      const r = await fetch(`${API}/admin/sync`, {
        method: "POST", headers: { "X-Admin-Token": token },
      });
      const d = await r.json();
      if (!r.ok) {
        setSyncMsg(`Error: ${d.error || "Sync failed"}`);
        setSyncStatus("error");
        setSyncing(false);
        setTimeout(() => { setSyncMsg(""); setSyncStatus(""); }, 8000);
        return;
      }

      // Step 2: tell the live server to reload from the snapshot immediately
      let reloadOk = false;
      try {
        const rr = await fetch(`${API}/admin/reload-from-snapshot`, {
          method: "POST", headers: { "X-Admin-Token": token },
        });
        reloadOk = rr.ok;
      } catch {
        reloadOk = false;
      }

      if (reloadOk) {
        setSyncMsg(`Live ✓ — ${d.stories} stories, ${d.photos} photos updated.`);
        setSyncStatus("success");
      } else {
        setSyncMsg("Snapshot saved, but live reload failed — changes will appear on next deploy");
        setSyncStatus("warning");
      }
    } catch {
      setSyncMsg("Could not connect to server");
      setSyncStatus("error");
    }
    setSyncing(false);
    setTimeout(() => { setSyncMsg(""); setSyncStatus(""); }, 8000);
  };

  // ── Archive story (soft-delete) ────────────────────────────────────────────
  const deleteStory = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      const r = await fetch(`${API}/admin/stories/${selected}`, {
        method: "DELETE", headers: { "X-Admin-Token": token },
      });
      if (r.ok) {
        const archived = stories.find(s => s.slug === selected);
        if (archived) setArchivedStories(prev => [archived, ...prev]);
        const remaining = stories.filter(s => s.slug !== selected);
        setStories(remaining);
        setSelected(remaining[0]?.slug ?? null);
        if (!remaining.length) setStory(null);
        setShowDelete(false);
      }
    } catch {}
    setDeleting(false);
  };

  // ── Restore archived story ─────────────────────────────────────────────────
  const restoreStory = async (slug: string) => {
    try {
      const r = await fetch(`${API}/admin/stories/${slug}/restore`, {
        method: "POST", headers: { "X-Admin-Token": token },
      });
      const d = await r.json();
      if (r.ok && d.story) {
        setArchivedStories(prev => prev.filter(s => s.slug !== slug));
        setStories(prev => [...prev, d.story].sort((a, b) => a.slug.localeCompare(b.slug)));
      }
    } catch {}
  };

  // ── Upload photos ──────────────────────────────────────────────────────────
  const uploadFiles = async (files: FileList) => {
    if (!selected || files.length === 0) return;
    setUploading(true);
    const nextPos = photos.length;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const urlRes = await fetch(`${API}/admin/photos/request-url`, {
          method: "POST", headers: apiHeaders(token),
        });
        const { uploadURL, objectPath } = await urlRes.json();
        await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
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
    const photo = photos.find(p => p.id === id);
    await fetch(`${API}/admin/photos/${id}`, { method: "DELETE", headers: { "X-Admin-Token": token } });
    setPhotos(prev => prev.filter(p => p.id !== id));
    // Clear heroImage if this photo was the hero
    if (photo && story && photo.url === story.heroImage) {
      await fetch(`${API}/admin/stories/${selected}`, {
        method: "PUT", headers: apiHeaders(token),
        body: JSON.stringify({ ...form, heroImage: null }),
      });
      setStory(prev => prev ? { ...prev, heroImage: null } : prev);
    }
  };

  // ── Set hero image ─────────────────────────────────────────────────────────
  const setHeroImage = async (url: string) => {
    if (!selected) return;
    await fetch(`${API}/admin/stories/${selected}`, {
      method: "PUT", headers: apiHeaders(token),
      body: JSON.stringify({ ...form, heroImage: url }),
    });
    setStory(prev => prev ? { ...prev, heroImage: url } : prev);
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

      {/* ── New Story Modal ───────────────────────────────────────────────── */}
      {showNew && (
        <div
          onClick={() => setShowNew(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(26,22,18,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: bg, width: 440, padding: 48, borderRadius: 2 }}
          >
            <h2 style={{ ...serif, fontSize: 24, fontWeight: 300, margin: "0 0 32px", color: ink }}>New Story</h2>
            <div style={{ marginBottom: 20 }}>
              <label style={label}>Couple names *</label>
              <input
                style={input}
                placeholder="e.g. Priya & Rohan"
                value={newCouple}
                autoFocus
                onChange={e => {
                  setNewCouple(e.target.value);
                  setNewSlug(toSlug(e.target.value));
                }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={label}>Location</label>
              <input
                style={input}
                placeholder="e.g. Udaipur, India"
                value={newLocation}
                onChange={e => setNewLocation(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={label}>URL slug (auto-generated)</label>
              <input
                style={{ ...input, color: `${ink}60` }}
                value={newSlug}
                onChange={e => setNewSlug(e.target.value)}
              />
              <p style={{ ...sans, fontSize: 11, color: `${ink}45`, marginTop: 6 }}>
                Will appear at /beginnings/{newSlug || "…"}
              </p>
            </div>
            {createError && <p style={{ ...sans, fontSize: 12, color: "#c0392b", marginBottom: 16 }}>{createError}</p>}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={createStory}
                disabled={creating || !newCouple.trim()}
                style={{ ...sans, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: bg, background: ink, border: "none", padding: "12px 28px", cursor: "pointer", opacity: creating || !newCouple.trim() ? 0.5 : 1, flex: 1 }}
              >{creating ? "Creating…" : "Create Story"}</button>
              <button
                onClick={() => { setShowNew(false); setCreateError(""); setNewCouple(""); setNewLocation(""); setNewSlug(""); }}
                style={{ ...sans, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: `${ink}60`, background: "transparent", border: line, padding: "12px 20px", cursor: "pointer" }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Archive Confirmation Modal ────────────────────────────────────── */}
      {showDelete && (
        <div
          onClick={() => setShowDelete(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(26,22,18,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: bg, width: 400, padding: 40, borderRadius: 2 }}
          >
            <h2 style={{ ...serif, fontSize: 22, fontWeight: 300, margin: "0 0 12px", color: ink }}>Archive story?</h2>
            <p style={{ ...sans, fontSize: 13, color: `${ink}65`, lineHeight: 1.6, marginBottom: 28 }}>
              <strong>{story?.couple}</strong> will be moved to the archive. You can restore it at any time from the Archived Stories section.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={deleteStory}
                disabled={deleting}
                style={{ ...sans, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", background: "#c0392b", border: "none", padding: "12px 24px", cursor: "pointer", opacity: deleting ? 0.6 : 1 }}
              >{deleting ? "Archiving…" : "Archive"}</button>
              <button
                onClick={() => setShowDelete(false)}
                style={{ ...sans, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: `${ink}60`, background: "transparent", border: line, padding: "12px 20px", cursor: "pointer" }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside style={{ width: 240, borderRight: line, padding: "32px 0", flexShrink: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 24px 24px", borderBottom: line }}>
          <p style={{ ...serif, fontSize: 20, fontWeight: 300, margin: 0 }}>Evermor</p>
          <p style={{ fontSize: 11, color: `${ink}55`, letterSpacing: "0.18em", textTransform: "uppercase", margin: "4px 0 0" }}>Admin</p>
        </div>
        <div style={{ padding: "16px 0", flex: 1 }}>
          {/* Tab: Stories */}
          <button
            onClick={() => setActiveTab("stories")}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "8px 24px", border: "none", cursor: "pointer",
              background: "transparent",
              borderLeft: activeTab === "stories" ? `2px solid ${ink}` : "2px solid transparent",
              color: activeTab === "stories" ? ink : `${ink}55`, fontSize: 11,
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 2,
            }}
          >Stories</button>
          {/* Tab: Slideshow */}
          <button
            onClick={() => setActiveTab("slideshow")}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "8px 24px", border: "none", cursor: "pointer",
              background: "transparent",
              borderLeft: activeTab === "slideshow" ? `2px solid ${ink}` : "2px solid transparent",
              color: activeTab === "slideshow" ? ink : `${ink}55`, fontSize: 11,
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12,
            }}
          >Slideshow</button>
          <button
            onClick={() => setActiveTab("enquiries")}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "8px 24px", border: "none", cursor: "pointer",
              background: "transparent",
              borderLeft: activeTab === "enquiries" ? `2px solid ${ink}` : "2px solid transparent",
              color: activeTab === "enquiries" ? ink : `${ink}55`, fontSize: 11,
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12,
            }}
          >
            Enquiries{enquiries.some(e => !e.readAt && !e.archivedAt) ? ` · ${enquiries.filter(e => !e.readAt && !e.archivedAt).length}` : ""}
          </button>

          {activeTab === "stories" && (<>
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
            <button
              onClick={() => setShowNew(true)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "10px 24px", border: "none", cursor: "pointer",
                background: "transparent", borderLeft: "2px solid transparent",
                color: `${ink}50`, fontSize: 12, marginTop: 8,
                letterSpacing: "0.1em", textTransform: "uppercase",
              }}
            >+ New story</button>

            {/* Archived stories disclosure */}
            {archivedStories.length > 0 && (
              <div style={{ marginTop: 16, borderTop: line, paddingTop: 12 }}>
                <button
                  onClick={() => setShowArchived(v => !v)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "6px 24px", border: "none", cursor: "pointer",
                    background: "transparent", color: `${ink}45`, fontSize: 11,
                    letterSpacing: "0.14em", textTransform: "uppercase",
                  }}
                >
                  {showArchived ? "▾" : "▸"} Archived ({archivedStories.length})
                </button>
                {showArchived && archivedStories.map(s => (
                  <div
                    key={s.slug}
                    style={{ padding: "8px 24px", display: "flex", flexDirection: "column", gap: 4 }}
                  >
                    <span style={{ fontSize: 12, color: `${ink}50` }}>{s.couple}</span>
                    <button
                      onClick={() => restoreStory(s.slug)}
                      style={{
                        alignSelf: "flex-start", fontSize: 10, letterSpacing: "0.12em",
                        textTransform: "uppercase", color: "#2e7d32", background: "transparent",
                        border: "none", cursor: "pointer", padding: 0,
                      }}
                    >Restore</button>
                  </div>
                ))}
              </div>
            )}
          </>)}
        </div>
        <div style={{ padding: "16px 24px", borderTop: line }}>
          {/* Sync to Production */}
          <button
            onClick={syncToProduction}
            disabled={syncing}
            style={{
              ...sans, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
              color: bg, background: syncing ? `${ink}70` : ink,
              border: "none", padding: "10px 16px", cursor: syncing ? "default" : "pointer",
              width: "100%", marginBottom: 10, opacity: syncing ? 0.7 : 1,
            }}
          >{syncing ? "Syncing…" : "Sync to Production"}</button>
          {syncMsg && (
            <p style={{
              ...sans, fontSize: 11, lineHeight: 1.5, margin: "0 0 10px",
              color: syncStatus === "error" ? "#c0392b" : syncStatus === "warning" ? "#b45309" : "#2e7d32",
              background: syncStatus === "warning" ? "#fffbeb" : "transparent",
              border: syncStatus === "warning" ? "1px solid #fcd34d" : "none",
              borderRadius: syncStatus === "warning" ? 3 : 0,
              padding: syncStatus === "warning" ? "6px 8px" : 0,
            }}>{syncMsg}</p>
          )}
          <button
            onClick={() => { localStorage.removeItem("evermor_admin"); setAuthed(false); setToken(""); }}
            style={{ ...sans, fontSize: 11, color: `${ink}50`, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >Sign out</button>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: "auto", padding: "40px 56px" }}>

        {/* ── Slideshow tab ──────────────────────────────────────────────── */}
        {activeTab === "slideshow" && (
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
              <div>
                <h2 style={{ ...serif, fontSize: 28, fontWeight: 300, margin: "0 0 6px" }}>Home Slideshow</h2>
                <p style={{ fontSize: 12, color: `${ink}55`, letterSpacing: "0.18em", textTransform: "uppercase", margin: 0 }}>
                  {slidePhotos.length} / 20 photos · drag to reorder
                </p>
              </div>
              <div>
                <input
                  ref={slideFileRef} type="file" accept="image/*" multiple
                  style={{ display: "none" }}
                  onChange={e => e.target.files && uploadSlideFiles(e.target.files)}
                />
                <button
                  onClick={() => slideFileRef.current?.click()}
                  disabled={slideUploading}
                  style={{ ...sans, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: bg, background: ink, border: "none", padding: "10px 24px", cursor: "pointer", opacity: slideUploading ? 0.6 : 1 }}
                >{slideUploading ? "Uploading…" : "+ Upload photos"}</button>
              </div>
            </div>

            {slidePhotos.length === 0 ? (
              <div
                onClick={() => slideFileRef.current?.click()}
                style={{ border: `1px dashed ${ink}30`, borderRadius: 4, padding: "56px 32px", textAlign: "center", cursor: "pointer", color: `${ink}45`, fontSize: 13 }}
              >
                Click to upload landscape photos for the home slideshow
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleSlideDragEnd}>
                <SortableContext items={slidePhotos.map(p => p.id)} strategy={rectSortingStrategy}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
                    {slidePhotos.map(p => (
                      <SortableSlideTile key={p.id} photo={p} onDelete={deleteSlidePhoto} />
                    ))}
                    {/* Upload tile */}
                    <div
                      onClick={() => slideFileRef.current?.click()}
                      style={{ border: `1px dashed ${ink}25`, borderRadius: 2, aspectRatio: "3/2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: `${ink}40`, fontSize: 22 }}
                    >+</div>
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        )}

        {activeTab === "enquiries" && (
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
              <div>
                <h2 style={{ ...serif, fontSize: 28, fontWeight: 300, margin: "0 0 6px" }}>Enquiries</h2>
                <p style={{ fontSize: 12, color: `${ink}55`, letterSpacing: "0.18em", textTransform: "uppercase", margin: 0 }}>
                  {enquiries.length} {enquiries.length === 1 ? "submission" : "submissions"}
                </p>
              </div>
              <button
                onClick={loadEnquiries}
                style={{ ...sans, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: ink, background: "transparent", border: line, padding: "10px 18px", cursor: "pointer" }}
              >Refresh</button>
            </div>
            {enquiryError && <p style={{ color: "#c0392b", fontSize: 13, margin: "-16px 0 20px" }}>{enquiryError}</p>}

            {enquiries.length === 0 ? (
              <div style={{ border: `1px dashed ${ink}30`, borderRadius: 4, padding: "56px 32px", textAlign: "center", color: `${ink}45`, fontSize: 13 }}>
                No enquiries yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {enquiries.map(enquiry => {
                  const archived = Boolean(enquiry.archivedAt);
                  const read = Boolean(enquiry.readAt);
                  const updating = updatingEnquiryIds.includes(enquiry.id);
                  return (
                    <article
                      key={enquiry.id}
                      style={{
                        border: line, borderLeft: `3px solid ${archived ? `${ink}25` : read ? `${ink}35` : ink}`,
                        padding: "20px 24px", opacity: archived ? 0.62 : 1,
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start", marginBottom: 14 }}>
                        <div>
                          <h3 style={{ ...serif, fontSize: 23, fontWeight: 400, margin: "0 0 5px" }}>{enquiry.names}</h3>
                          <p style={{ fontSize: 11, color: `${ink}55`, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                            Received {formatDate(enquiry.createdAt)} · {archived ? "Archived" : read ? "Read" : "Unread"}
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                          <button
                            onClick={() => updateEnquiry(enquiry.id, { read: !read })}
                            disabled={updating}
                            style={{ ...sans, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: ink, background: "transparent", border: line, padding: "8px 10px", cursor: updating ? "default" : "pointer", opacity: updating ? 0.5 : 1 }}
                          >{updating ? "Updating…" : read ? "Mark unread" : "Mark read"}</button>
                          <button
                            onClick={() => updateEnquiry(enquiry.id, { archived: !archived })}
                            disabled={updating}
                            style={{ ...sans, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: `${ink}70`, background: "transparent", border: line, padding: "8px 10px", cursor: updating ? "default" : "pointer", opacity: updating ? 0.5 : 1 }}
                          >{archived ? "Restore" : "Archive"}</button>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px 32px", fontSize: 13, lineHeight: 1.5 }}>
                        <div><span style={{ color: `${ink}55` }}>Email </span><a href={`mailto:${enquiry.email}`} style={{ color: ink }}>{enquiry.email}</a></div>
                        <div><span style={{ color: `${ink}55` }}>Phone </span><a href={`tel:${enquiry.phone}`} style={{ color: ink }}>{enquiry.phone}</a></div>
                        <div><span style={{ color: `${ink}55` }}>Location </span>{enquiry.location}</div>
                        <div><span style={{ color: `${ink}55` }}>Date </span>{enquiry.weddingDate}</div>
                        <div><span style={{ color: `${ink}55` }}>Venue </span>{enquiry.venue || "—"}</div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "stories" && (!story ? (
          <div style={{ paddingTop: 40 }}>
            <p style={{ color: `${ink}40`, fontSize: 14, marginBottom: 24 }}>No story selected.</p>
            <button
              onClick={() => setShowNew(true)}
              style={{ ...sans, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: bg, background: ink, border: "none", padding: "12px 28px", cursor: "pointer" }}
            >+ Create first story</button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40 }}>
              <div>
                <h2 style={{ ...serif, fontSize: 28, fontWeight: 300, margin: "0 0 4px" }}>{story.couple}</h2>
                <p style={{ fontSize: 12, color: `${ink}55`, letterSpacing: "0.18em", textTransform: "uppercase", margin: 0 }}>{story.location}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {saveMsg && <span style={{ fontSize: 12, color: saveMsg.includes("✓") ? "#2e7d32" : "#c0392b" }}>{saveMsg}</span>}
                <button
                  onClick={() => setShowDelete(true)}
                  style={{ ...sans, fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: `${ink}50`, background: "transparent", border: line, padding: "10px 18px", cursor: "pointer" }}
                >Archive</button>
                <button
                  onClick={save} disabled={saving}
                  style={{ ...sans, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: bg, background: ink, border: "none", padding: "10px 28px", cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1 }}
                >{saving ? "Saving…" : "Save"}</button>
              </div>
            </div>

            {/* ── Photos ────────────────────────────────────────────────── */}
            <section style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={label}>Photos <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: "none" }}>— drag to reorder · ☆ sets hero image</span></p>
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

              {/* Hero image indicator */}
              {story.heroImage && (
                <p style={{ ...sans, fontSize: 11, color: `${ink}45`, marginBottom: 16 }}>
                  Hero image is set — shown on the Beginnings index.
                </p>
              )}
              {!story.heroImage && photos.length > 0 && (
                <p style={{ ...sans, fontSize: 11, color: "#b8860b", marginBottom: 16 }}>
                  No hero image set. Click ☆ on a photo to use it as the cover on the Beginnings index.
                </p>
              )}

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
                        <SortablePhoto
                          key={p.id}
                          photo={p}
                          onDelete={deletePhoto}
                          isHero={p.url === story.heroImage}
                          onSetHero={setHeroImage}
                        />
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

            {/* ── Details ───────────────────────────────────────────────── */}
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

            {/* ── Video ─────────────────────────────────────────────────── */}
            <section style={{ borderTop: line, paddingTop: 40, marginBottom: 48 }}>
              <p style={label}>Film / video embed</p>
              <p style={{ fontSize: 12, color: `${ink}55`, marginBottom: 16, lineHeight: 1.6 }}>Paste a YouTube or Vimeo URL. The film section will show an embedded player instead of "available soon".</p>
              <input
                style={{ ...input, marginBottom: 16 }}
                placeholder="https://www.youtube.com/watch?v=..."
                value={form.videoUrl}
                onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
              />
              <label style={label}>Film runtime</label>
              <input
                style={{ ...input, marginBottom: embed ? 20 : 0 }}
                placeholder="e.g. 16 min"
                value={form.filmRuntime}
                onChange={e => setForm(f => ({ ...f, filmRuntime: e.target.value }))}
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
        ))}
      </main>
    </div>
  );
}
