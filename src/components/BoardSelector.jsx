import { useState } from "react";
import { createBoard, createColumn } from "../lib/database";
import { DEFAULT_COLUMNS } from "../lib/constants";

export default function BoardSelector({ boards, userId, onSelect, onRefresh, onLogout, onManageUsers, profile }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [emoji, setEmoji] = useState("📋");
  const [template, setTemplate] = useState("general");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const board = await createBoard(name.trim(), desc.trim(), emoji, userId);
      // Create template columns
      const cols = DEFAULT_COLUMNS[template] || DEFAULT_COLUMNS.general;
      for (const col of cols) {
        await createColumn(board.id, col.name, col.emoji, col.position);
      }
      setCreating(false);
      setName("");
      setDesc("");
      onRefresh();
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.logo}>
              <span style={{ color: "var(--accent)" }}>Findmysec8</span>.com
            </h1>
            <p style={styles.subtitle}>Select a board to get started</p>
          </div>
          <div style={styles.userArea}>
            {onManageUsers && (
              <button onClick={onManageUsers} style={styles.manageUsersBtn}>
                Manage Users
              </button>
            )}
            <div style={{ ...styles.avatar, background: profile?.avatar_color || "var(--accent)" }}>
              {initials}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600 }}>{profile?.full_name}</p>
              <p style={{ fontSize: 10, color: "var(--accent)", fontWeight: 600, textTransform: "uppercase" }}>{profile?.role}</p>
              <button onClick={onLogout} style={styles.logoutBtn}>Sign out</button>
            </div>
          </div>
        </div>

        {/* Board grid */}
        <div style={styles.grid}>
          {boards.map((b) => (
            <button key={b.id} style={styles.boardCard} onClick={() => onSelect(b)}>
              <span style={styles.boardEmoji}>{b.emoji}</span>
              <h3 style={styles.boardName}>{b.name}</h3>
              <p style={styles.boardDesc}>{b.description || "No description"}</p>
              <span style={styles.roleBadge}>{b.memberRole}</span>
            </button>
          ))}

          {/* Create new board */}
          <button style={styles.createCard} onClick={() => setCreating(true)}>
            <span style={{ fontSize: 28, opacity: 0.4 }}>+</span>
            <p style={{ fontSize: 13, color: "var(--text-dim)" }}>New Board</p>
          </button>
        </div>

        {/* Create modal */}
        {creating && (
          <div style={styles.overlay} onClick={() => setCreating(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2 style={styles.modalTitle}>Create New Board</h2>

              <div style={styles.fieldWrap}>
                <label style={styles.label}>Board Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marketing, Sales, Operations"
                  style={styles.input}
                  autoFocus
                />
              </div>

              <div style={styles.fieldWrap}>
                <label style={styles.label}>Description</label>
                <input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="What is this board for?"
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldWrap}>
                <label style={styles.label}>Icon</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["📋", "🎯", "📢", "💰", "🏠", "⚙️", "🚀", "📊"].map((e) => (
                    <button
                      key={e}
                      onClick={() => setEmoji(e)}
                      style={{
                        ...styles.emojiBtn,
                        background: emoji === e ? "var(--accent-soft)" : "var(--bg)",
                        border: `1px solid ${emoji === e ? "var(--accent)" : "var(--border)"}`,
                      }}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.fieldWrap}>
                <label style={styles.label}>Column Template</label>
                <select value={template} onChange={(e) => setTemplate(e.target.value)} style={styles.input}>
                  <option value="general">General (To Do → Done)</option>
                  <option value="development">Development (Backlog → Deployed)</option>
                  <option value="marketing">Marketing (Ideas → Published)</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
                <button onClick={() => setCreating(false)} style={styles.ghostBtn}>Cancel</button>
                <button onClick={handleCreate} disabled={!name.trim() || loading} style={styles.primaryBtn}>
                  {loading ? "Creating…" : "Create Board"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "var(--bg)", padding: "40px 24px" },
  inner: { maxWidth: 900, margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 40,
    flexWrap: "wrap",
    gap: 16,
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  subtitle: { color: "var(--text-dim)", fontSize: 14, marginTop: 4 },
  userArea: { display: "flex", alignItems: "center", gap: 12 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 700,
    color: "#000",
  },
  logoutBtn: {
    background: "none",
    border: "none",
    color: "var(--text-dim)",
    fontSize: 12,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    padding: 0,
    textDecoration: "underline",
  },
  manageUsersBtn: {
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "8px 16px",
    color: "var(--accent)",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: 16,
  },
  boardCard: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    padding: "24px 20px",
    textAlign: "left",
    cursor: "pointer",
    transition: "border-color 0.2s, transform 0.15s",
    fontFamily: "'DM Sans', sans-serif",
    color: "var(--text)",
    position: "relative",
  },
  boardEmoji: { fontSize: 28, display: "block", marginBottom: 12 },
  boardName: { fontSize: 16, fontWeight: 600, marginBottom: 6 },
  boardDesc: { fontSize: 13, color: "var(--text-dim)", lineHeight: 1.4 },
  roleBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "var(--accent-soft)",
    color: "var(--accent)",
    fontSize: 10,
    fontWeight: 600,
    padding: "3px 8px",
    borderRadius: 6,
    textTransform: "uppercase",
  },
  createCard: {
    background: "var(--surface)",
    border: "2px dashed var(--border)",
    borderRadius: 14,
    padding: "40px 20px",
    textAlign: "center",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    color: "var(--text)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 150,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    padding: 24,
  },
  modal: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "28px 32px",
    width: "100%",
    maxWidth: 460,
    boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
  },
  modalTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 20,
    color: "var(--accent)",
  },
  fieldWrap: { marginBottom: 14 },
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    color: "var(--text-dim)",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  input: {
    width: "100%",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "9px 14px",
    color: "var(--text)",
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
  },
  emojiBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    fontSize: 18,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtn: {
    background: "var(--accent)",
    color: "#000",
    border: "none",
    borderRadius: 8,
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  ghostBtn: {
    background: "var(--surface2)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "8px 18px",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
};
