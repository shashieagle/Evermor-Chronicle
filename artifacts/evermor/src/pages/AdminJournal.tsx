import { useState, useEffect, useCallback, useRef } from "react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
const API  = `${BASE}/api`;

interface Post {
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  body: string | null;
  coverImage: string | null;
  published: boolean;
  publishedAt: string | null;
}

function apiHeaders(token: string) {
  return { "Content-Type": "application/json", "X-Admin-Token": token };
}

function toSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const CATEGORIES = ["Reflection", "Field Notes", "For Couples", "Behind the Work"];

// ── Styles (matching existing admin) ──────────────────────────────────────────
const bg   = "#F5F0E8";
const ink  = "#3A342C";
const mid  = "#EAE3D3";
const line = `1px solid ${ink}18`;
const serif = { fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif" };
const sans  = { fontFamily: "'Inter',sans-serif" };
const labelStyle = { ...sans, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase" as const, color: `${ink}70`, display: "block", marginBottom: 6 };
const inputStyle = { ...sans, fontSize: 14, color: ink, background: "transparent", border: line, borderRadius: 2, padding: "8px 12px", width: "100%", outline: "none", boxSizing: "border-box" as const };
const textareaStyle = { ...inputStyle, resize: "vertical" as const, lineHeight: 1.7 };

export default function AdminJournal() {
  const [token, setToken]         = useState(() => localStorage.getItem("evermor_admin") || "");
  const [authed, setAuthed]       = useState(false);
  const [authError, setAuthError] = useState("");
  const [pwInput, setPwInput]     = useState("");

  const [posts, setPosts]         = useState<Post[]>([]);
  const [selected, setSelected]   = useState<string | null>(null);
  const [post, setPost]           = useState<Post | null>(null);

  const [form, setForm] = useState({
    title: "", category: "Reflection", excerpt: "", body: "", coverImage: "", published: false,
  });

  const [saving, setSaving]   = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug]   = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting]     = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // ── Auth ───────────────────────────────────────────────────────────────────
  const verify = useCallback(async (t: string) => {
    try {
      const r = await fetch(`${API}/admin/verify`, { method: "POST", headers: apiHeaders(t) });
      if (r.ok) { localStorage.setItem("evermor_admin", t); setToken(t); setAuthed(true); setAuthError(""); }
      else setAuthError("Incorrect password");
    } catch { setAuthError("Could not connect"); }
  }, []);

  useEffect(() => { if (token) verify(token); }, []);

  // ── Load posts ─────────────────────────────────────────────────────────────
  const loadPosts = useCallback(async () => {
    if (!authed) return;
    const r = await fetch(`${API}/admin/journal`, { headers: { "X-Admin-Token": token } });
    const d = await r.json();
    const list: Post[] = d.posts || [];
    setPosts(list);
    if (list.length && !selected) setSelected(list[0].slug);
  }, [authed, token]);

  useEffect(() => { loadPosts(); }, [authed]);

  // ── Load selected post ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!selected || !authed) return;
    fetch(`${API}/admin/journal/${selected}`, { headers: { "X-Admin-Token": token } })
      .then(r => r.json())
      .then(d => {
        setPost(d.post);
        setForm({
          title:      d.post.title      || "",
          category:   d.post.category   || "Reflection",
          excerpt:    d.post.excerpt    || "",
          body:       d.post.body       || "",
          coverImage: d.post.coverImage || "",
          published:  d.post.published  ?? false,
        });
      })
      .catch(() => {});
  }, [selected, authed]);

  // ── Save ───────────────────────────────────────────────────────────────────
  const save = async () => {
    if (!selected) return;
    setSaving(true); setSaveMsg("");
    try {
      const r = await fetch(`${API}/admin/journal/${selected}`, {
        method: "PUT", headers: apiHeaders(token),
        body: JSON.stringify(form),
      });
      setSaveMsg(r.ok ? "Saved ✓" : "Error saving");
      if (r.ok) {
        // Refresh the sidebar list to reflect title/published changes
        loadPosts();
      }
      setTimeout(() => setSaveMsg(""), 3000);
    } catch { setSaveMsg("Error saving"); }
    setSaving(false);
  };

  // ── Create post ────────────────────────────────────────────────────────────
  const createPost = async () => {
    if (!newTitle.trim()) return;
    setCreating(true); setCreateError("");
    const slug = newSlug || toSlug(newTitle);
    try {
      const r = await fetch(`${API}/admin/journal`, {
        method: "POST", headers: apiHeaders(token),
        body: JSON.stringify({ slug, title: newTitle }),
      });
      const d = await r.json();
      if (!r.ok) { setCreateError(d.error || "Failed to create"); setCreating(false); return; }
      setPosts(prev => [d.post, ...prev]);
      setSelected(d.post.slug);
      setShowNew(false); setNewTitle(""); setNewSlug("");
    } catch { setCreateError("Could not connect"); }
    setCreating(false);
  };

  // ── Delete post ────────────────────────────────────────────────────────────
  const deletePost = async () => {
    if (!selected) return;
    setDeleting(true);
    try {
      await fetch(`${API}/admin/journal/${selected}`, {
        method: "DELETE", headers: { "X-Admin-Token": token },
      });
      const remaining = posts.filter(p => p.slug !== selected);
      setPosts(remaining);
      setSelected(remaining[0]?.slug ?? null);
      if (!remaining.length) setPost(null);
      setShowDelete(false);
    } catch {}
    setDeleting(false);
  };

  // ── Upload cover image ────────────────────────────────────────────────────
  const uploadCover = async (file: File) => {
    setUploading(true);
    try {
      const urlRes = await fetch(`${API}/admin/photos/request-url`, {
        method: "POST", headers: apiHeaders(token),
      });
      if (!urlRes.ok) throw new Error(`Upload URL request failed (${urlRes.status})`);
      const { uploadURL, objectPath } = await urlRes.json();
      const uploadRes = await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      if (!uploadRes.ok) throw new Error(`Cover upload failed (${uploadRes.status})`);
      // Construct public URL (same pattern as story photos)
      const pubRes = await fetch(`${API}/admin/journal/${selected}/cover`, {
        method: "POST", headers: apiHeaders(token),
        body: JSON.stringify({ objectPath }),
      });
      if (!pubRes.ok) throw new Error(`Saving cover image failed (${pubRes.status})`);
      const { coverImage } = await pubRes.json();
      setForm(f => ({ ...f, coverImage }));
    } catch (e) { console.error("Upload failed:", e); }
    setUploading(false);
  };

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 360, padding: 48 }}>
          <h1 style={{ ...serif, fontSize: 32, fontWeight: 300, color: ink, margin: "0 0 8px" }}>Evermor</h1>
          <p style={{ ...sans, fontSize: 11, color: `${ink}55`, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 40 }}>Journal Admin</p>
          <label style={labelStyle}>Password</label>
          <input
            type="password" value={pwInput}
            onChange={e => setPwInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && verify(pwInput)}
            style={{ ...inputStyle, marginBottom: 16 }} autoFocus
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

  return (
    <div style={{ minHeight: "100vh", background: bg, color: ink, display: "flex", ...sans }}>

      {/* ── New Post Modal ────────────────────────────────────────────────── */}
      {showNew && (
        <div onClick={() => setShowNew(false)} style={{ position: "fixed", inset: 0, background: "rgba(26,22,18,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: bg, width: 440, padding: 48, borderRadius: 2 }}>
            <h2 style={{ ...serif, fontSize: 24, fontWeight: 300, margin: "0 0 32px" }}>New Article</h2>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Title *</label>
              <input
                style={inputStyle} placeholder="Article title" value={newTitle} autoFocus
                onChange={e => { setNewTitle(e.target.value); setNewSlug(toSlug(e.target.value)); }}
              />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>URL slug (auto-generated)</label>
              <input style={{ ...inputStyle, color: `${ink}60` }} value={newSlug} onChange={e => setNewSlug(e.target.value)} />
              <p style={{ ...sans, fontSize: 11, color: `${ink}45`, marginTop: 6 }}>
                Will appear at /journal/{newSlug || "…"}
              </p>
            </div>
            {createError && <p style={{ fontSize: 12, color: "#c0392b", marginBottom: 16 }}>{createError}</p>}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={createPost} disabled={creating || !newTitle.trim()}
                style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: bg, background: ink, border: "none", padding: "12px 28px", cursor: "pointer", opacity: creating || !newTitle.trim() ? 0.5 : 1, flex: 1 }}
              >{creating ? "Creating…" : "Create"}</button>
              <button
                onClick={() => { setShowNew(false); setCreateError(""); setNewTitle(""); setNewSlug(""); }}
                style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: `${ink}60`, background: "transparent", border: line, padding: "12px 20px", cursor: "pointer" }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ─────────────────────────────────────────────────── */}
      {showDelete && (
        <div onClick={() => setShowDelete(false)} style={{ position: "fixed", inset: 0, background: "rgba(26,22,18,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: bg, width: 400, padding: 40, borderRadius: 2 }}>
            <h2 style={{ ...serif, fontSize: 22, fontWeight: 300, margin: "0 0 12px" }}>Delete article?</h2>
            <p style={{ fontSize: 13, color: `${ink}65`, lineHeight: 1.6, marginBottom: 28 }}>
              This will permanently delete <strong>"{post?.title}"</strong>. This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={deletePost} disabled={deleting}
                style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: "#fff", background: "#c0392b", border: "none", padding: "12px 24px", cursor: "pointer", opacity: deleting ? 0.6 : 1 }}
              >{deleting ? "Deleting…" : "Delete"}</button>
              <button onClick={() => setShowDelete(false)}
                style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: `${ink}60`, background: "transparent", border: line, padding: "12px 20px", cursor: "pointer" }}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside style={{ width: 260, borderRight: line, padding: "32px 0", flexShrink: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "0 24px 24px", borderBottom: line }}>
          <p style={{ ...serif, fontSize: 20, fontWeight: 300, margin: 0 }}>Evermor</p>
          <p style={{ fontSize: 11, color: `${ink}55`, letterSpacing: "0.18em", textTransform: "uppercase", margin: "4px 0 16px" }}>Journal Admin</p>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="/admin" style={{ fontSize: 11, color: `${ink}45`, textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase" }}>← Stories</a>
          </div>
        </div>

        <div style={{ padding: "16px 0", flex: 1 }}>
          <p style={{ ...labelStyle, padding: "0 24px", marginBottom: 8 }}>Articles</p>
          {posts.length === 0 && (
            <p style={{ fontSize: 13, color: `${ink}40`, padding: "8px 24px" }}>No articles yet.</p>
          )}
          {posts.map(p => (
            <button key={p.slug} onClick={() => setSelected(p.slug)} style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "10px 24px", border: "none", cursor: "pointer",
              background: selected === p.slug ? mid : "transparent",
              borderLeft: selected === p.slug ? `2px solid ${ink}` : "2px solid transparent",
              color: ink, fontSize: 13,
            }}>
              <div style={{ fontWeight: selected === p.slug ? 500 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {p.title}
              </div>
              <div style={{ fontSize: 11, color: `${ink}50`, marginTop: 2, display: "flex", gap: 6 }}>
                <span>{p.category}</span>
                {p.published && <span style={{ color: "#2e7d32" }}>· Published</span>}
              </div>
            </button>
          ))}
          <button onClick={() => setShowNew(true)} style={{
            display: "block", width: "100%", textAlign: "left",
            padding: "10px 24px", border: "none", cursor: "pointer",
            background: "transparent", borderLeft: "2px solid transparent",
            color: `${ink}50`, fontSize: 12, marginTop: 8,
            letterSpacing: "0.1em", textTransform: "uppercase",
          }}>+ New article</button>
        </div>

        <div style={{ padding: "16px 24px", borderTop: line }}>
          <button onClick={() => { localStorage.removeItem("evermor_admin"); setAuthed(false); setToken(""); }}
            style={{ fontSize: 11, color: `${ink}50`, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" }}
          >Sign out</button>
        </div>
      </aside>

      {/* ── Main editor ───────────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: "auto", padding: "40px 56px" }}>
        {!post ? (
          <div style={{ paddingTop: 40 }}>
            <p style={{ color: `${ink}40`, fontSize: 14, marginBottom: 24 }}>No article selected.</p>
            <button onClick={() => setShowNew(true)}
              style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: bg, background: ink, border: "none", padding: "12px 28px", cursor: "pointer" }}
            >+ Write first article</button>
          </div>
        ) : (
          <>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40 }}>
              <div>
                <h2 style={{ ...serif, fontSize: 28, fontWeight: 300, margin: "0 0 4px" }}>{post.title}</h2>
                <p style={{ fontSize: 12, color: `${ink}55`, letterSpacing: "0.18em", textTransform: "uppercase", margin: 0 }}>
                  {form.published ? "Published" : "Draft"}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {saveMsg && <span style={{ fontSize: 12, color: saveMsg.includes("✓") ? "#2e7d32" : "#c0392b" }}>{saveMsg}</span>}
                <button onClick={() => setShowDelete(true)}
                  style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: `${ink}50`, background: "transparent", border: line, padding: "10px 18px", cursor: "pointer" }}
                >Delete</button>
                <button onClick={save} disabled={saving}
                  style={{ fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", color: bg, background: ink, border: "none", padding: "10px 28px", cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1 }}
                >{saving ? "Saving…" : "Save"}</button>
              </div>
            </div>

            {/* Fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
              <div>
                <label style={labelStyle}>Title</label>
                <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select
                  style={{ ...inputStyle, appearance: "none" }}
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Excerpt <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: "none" }}>— shown on the Journal index</span></label>
              <textarea
                style={{ ...textareaStyle, minHeight: 72 }}
                value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                placeholder="A one or two sentence summary of the article."
              />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Body <span style={{ fontWeight: 400, letterSpacing: 0, textTransform: "none" }}>— separate paragraphs with a blank line</span></label>
              <textarea
                style={{ ...textareaStyle, minHeight: 380 }}
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                placeholder={"Write your article here.\n\nLeave a blank line between paragraphs."}
              />
            </div>

            {/* Cover image */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Cover image</label>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={form.coverImage}
                  onChange={e => setForm(f => ({ ...f, coverImage: e.target.value }))}
                  placeholder="Paste a URL, or upload below"
                />
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => e.target.files?.[0] && uploadCover(e.target.files[0])} />
                <button
                  onClick={() => fileRef.current?.click()} disabled={uploading}
                  style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: ink, background: "transparent", border: line, padding: "9px 18px", cursor: "pointer", opacity: uploading ? 0.6 : 1, whiteSpace: "nowrap" }}
                >{uploading ? "Uploading…" : "↑ Upload"}</button>
              </div>
              {form.coverImage && (
                <img src={form.coverImage} alt="" style={{ marginTop: 12, height: 120, objectFit: "cover", borderRadius: 2 }} />
              )}
            </div>

            {/* Publish toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 0", borderTop: line }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                  style={{ width: 16, height: 16, cursor: "pointer" }}
                />
                <span style={{ fontSize: 13, color: ink }}>
                  {form.published ? "Published — visible on /journal" : "Draft — not visible publicly"}
                </span>
              </label>
              {form.published && post.slug && (
                <a href={`/journal/${post.slug}`} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 12, color: `${ink}50`, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
                >View article →</a>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
