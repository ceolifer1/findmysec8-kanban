import { useState, useEffect } from "react";
import { getAllUsers, createAppUser, updateUserRole, deleteAppUser } from "../lib/database";

export default function UserManagement({ profile, onBack }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isSuperadmin = profile?.role === "superadmin";
  const isAdmin = profile?.role === "admin";

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = async (user) => {
    if (!confirm(`Remove ${user.email}? This cannot be undone.`)) return;
    try {
      await deleteAppUser(user.id);
      setSuccess(`${user.email} has been removed.`);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRoleChange = async (user, newRole) => {
    try {
      await updateUserRole(user.id, newRole);
      setSuccess(`${user.email} is now ${newRole}.`);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const roleOptions = isSuperadmin
    ? ["user", "admin"]
    : ["user"];

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg)" }}>
        <p style={{ color: "var(--text-dim)" }}>Loading users…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "40px 24px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          <div>
            <button onClick={onBack} style={backBtn}>← Back to Boards</button>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, marginTop: 8 }}>
              <span style={{ color: "var(--accent)" }}>User</span> Management
            </h1>
            <p style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>
              {isSuperadmin ? "Superadmin — full control" : "Admin — can manage users"}
            </p>
          </div>
          <button onClick={() => { setShowCreate(true); setError(""); setSuccess(""); }} style={primaryBtn}>
            + Add User
          </button>
        </div>

        {error && <div style={errorBox}>{error}</div>}
        {success && <div style={successBox}>{success}</div>}

        {/* User List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {users.map((u) => {
            const isSelf = u.id === profile.id;
            const isTargetSuperadmin = u.role === "superadmin";
            const isTargetAdmin = u.role === "admin";
            const canModify = !isSelf && !isTargetSuperadmin && (isSuperadmin || (isAdmin && !isTargetAdmin));

            return (
              <div key={u.id} style={userRow}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                  <div style={{ ...avatar, background: u.avatar_color || "var(--accent)" }}>
                    {(u.full_name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>
                      {u.full_name || "No name"}
                      {isSelf && <span style={{ color: "var(--accent)", fontSize: 11, marginLeft: 8 }}>(you)</span>}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-dim)" }}>{u.email}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {canModify ? (
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u, e.target.value)}
                      style={selectStyle}
                    >
                      {roleOptions.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                      {/* Show current role even if not in options */}
                      {!roleOptions.includes(u.role) && (
                        <option value={u.role}>{u.role}</option>
                      )}
                    </select>
                  ) : (
                    <span style={roleBadge(u.role)}>{u.role}</span>
                  )}
                  {canModify && (
                    <button onClick={() => handleDelete(u)} style={dangerBtn} title="Remove user">
                      ×
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Create User Modal */}
        {showCreate && (
          <CreateUserModal
            isSuperadmin={isSuperadmin}
            onClose={() => setShowCreate(false)}
            onCreated={(msg) => {
              setShowCreate(false);
              setSuccess(msg);
              loadUsers();
            }}
            onError={(msg) => setError(msg)}
          />
        )}
      </div>
    </div>
  );
}

function CreateUserModal({ isSuperadmin, onClose, onCreated, onError }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !fullName.trim()) return;
    setLoading(true);
    try {
      await createAppUser(email.trim(), password.trim(), fullName.trim(), role);
      onCreated(`${email} created as ${role}.`);
    } catch (err) {
      onError(err.message);
    }
    setLoading(false);
  };

  return (
    <div onClick={onClose} style={overlay}>
      <div onClick={(e) => e.stopPropagation()} style={modal}>
        <h2 style={modalTitle}>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div style={fieldWrap}>
            <label style={label}>Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" style={input} required autoFocus />
          </div>
          <div style={fieldWrap}>
            <label style={label}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" style={input} required />
          </div>
          <div style={fieldWrap}>
            <label style={label}>Password</label>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Temporary password" style={input} required minLength={6} />
          </div>
          <div style={fieldWrap}>
            <label style={label}>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={input}>
              <option value="user">User</option>
              {isSuperadmin && <option value="admin">Admin</option>}
            </select>
            <p style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 6 }}>
              {role === "admin"
                ? "Admins can manage users (except superadmin) and all boards."
                : "Users can access boards they are added to. No user management."}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
            <button type="button" onClick={onClose} style={ghostBtn}>Cancel</button>
            <button type="submit" disabled={loading} style={primaryBtn}>
              {loading ? "Creating…" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Styles ── */
const backBtn = { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 14px", color: "var(--text-dim)", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" };
const primaryBtn = { background: "var(--accent)", color: "#000", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" };
const ghostBtn = { background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" };
const dangerBtn = { background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: 8, width: 32, height: 32, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" };
const userRow = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, gap: 12 };
const avatar = { width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#000", flexShrink: 0 };
const selectStyle = { background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 10px", color: "var(--text)", fontSize: 12, fontFamily: "'DM Sans', sans-serif", outline: "none" };
const roleBadge = (role) => ({
  fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.04em",
  background: role === "superadmin" ? "rgba(212,148,58,0.15)" : role === "admin" ? "rgba(139,92,246,0.15)" : "var(--surface2)",
  color: role === "superadmin" ? "var(--accent)" : role === "admin" ? "#8b5cf6" : "var(--text-dim)",
});
const errorBox = { background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 };
const successBox = { background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", borderRadius: 8, padding: "10px 14px", fontSize: 13, marginBottom: 16 };
const overlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 24 };
const modal = { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "28px 32px", width: "100%", maxWidth: 460, boxShadow: "0 24px 64px rgba(0,0,0,0.5)" };
const modalTitle = { fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, marginBottom: 20, color: "var(--accent)" };
const fieldWrap = { marginBottom: 14 };
const label = { display: "block", fontSize: 11, fontWeight: 600, color: "var(--text-dim)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" };
const input = { width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 14px", color: "var(--text)", fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none" };
