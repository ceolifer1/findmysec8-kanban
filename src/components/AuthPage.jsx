import { useState } from "react";
import { signIn } from "../lib/database";

export default function AuthPage({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      onAuth();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoWrap}>
          <h1 style={styles.logo}>
            <span style={{ color: "var(--accent)" }}>Findmysec8</span>.com
          </h1>
          <p style={styles.subtitle}>Team Workspace</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.fieldWrap}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.fieldWrap}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              required
              minLength={6}
            />
          </div>

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Please wait…" : "Sign In"}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>Access is managed by your administrator.</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
    padding: 24,
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: "40px 36px",
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
  },
  logoWrap: { textAlign: "center", marginBottom: 32 },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 26,
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.02em",
  },
  subtitle: { color: "var(--text-dim)", fontSize: 13, marginTop: 4 },
  fieldWrap: { marginBottom: 16 },
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
    padding: "10px 14px",
    color: "var(--text)",
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
  },
  btn: {
    width: "100%",
    padding: "12px 20px",
    background: "var(--accent)",
    color: "#000",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    marginTop: 8,
  },
  errorBox: {
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.3)",
    color: "#ef4444",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 16,
  },
  successBox: {
    background: "rgba(34,197,94,0.12)",
    border: "1px solid rgba(34,197,94,0.3)",
    color: "#22c55e",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    marginBottom: 16,
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 20,
  },
  footerText: { color: "var(--text-dim)", fontSize: 13 },
  link: {
    background: "none",
    border: "none",
    color: "var(--accent)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    textDecoration: "underline",
  },
};
