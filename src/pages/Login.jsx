import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import apiClient from "../utils/apiClient";
import AuthContext from "../context/AuthContext";

function Login() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await apiClient.post("/users/login", {
        email: String(email).trim().toLowerCase(),
        password: String(password),
      });
      auth?.login?.(res.data);
      setMessage("Login Success");

      // Clear form
      setEmail("");
      setPassword("");
      const from = location.state?.from || "/profile";
      navigate(from);

    } catch (error) {
      // axios interceptor now throws plain Error with message property
      const serverMsg = error?.message;
      setMessage(serverMsg ? `Login Failed: ${serverMsg}` : "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p className="subtitle">Login to your eyewear store account</p>
        </div>

        {message && (
          <div className={`message ${message.includes('Success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don&apos;t have an account? <Link to="/signup">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
