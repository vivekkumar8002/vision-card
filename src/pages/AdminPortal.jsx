import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import apiClient from "../utils/apiClient";

function AdminPortal() {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout } = useContext(AuthContext);
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await apiClient.post("/users/login", { email, password });
        login(res.data);
      } else {
        const res = await apiClient.post("/users/signup", { name, email, password });
        login(res.data);
      }
      navigate("/admin");
    } catch (err) {
      setError("Operation failed. Check inputs or try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated && user?.isAdmin) {
    return (
      <main className="admin-portal" style={{ maxWidth: 960, margin: "20px auto", padding: 16 }}>
        <h2>Admin Panel</h2>
        <p>Welcome, {user.name}</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link className="btn" to="/admin">Dashboard</Link>
          <Link className="btn" to="/admin/orders">Orders</Link>
          <Link className="btn" to="/admin/products">Products</Link>
          <button type="button" className="btn" onClick={() => { logout(); }}>Logout</button>
        </div>
      </main>
    );
  }

  if (isAuthenticated && !user?.isAdmin) {
    return (
      <main style={{ maxWidth: 640, margin: "20px auto", padding: 16 }}>
        <h2>Admin Panel</h2>
        <p>You are logged in but not an admin.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <Link className="btn" to="/profile">Go to Profile</Link>
          <button type="button" className="btn" onClick={() => logout()}>Logout</button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 560, margin: "20px auto", padding: 16 }}>
      <h2>Admin Login / Signup</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button type="button" onClick={() => setMode("login")} className="btn">
          Login
        </button>
        <button type="button" onClick={() => setMode("signup")} className="btn">
          Signup
        </button>
      </div>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        {mode === "signup" && (
          <label htmlFor="name">
            Name
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        )}
        <label htmlFor="email">
          Email
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label htmlFor="password">
          Password
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <div style={{ color: "crimson" }}>{error}</div>}
        <button type="submit" className="btn" disabled={loading}>
          {(() => {
            if (loading) return "Please wait...";
            if (mode === "login") return "Login";
            return "Signup";
          })()}
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        <Link to="/">Back to Home</Link>
      </div>
    </main>
  );
}

export default AdminPortal;
