import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import apiClient from "../utils/apiClient";
import AuthContext from "../context/AuthContext";

function Signup() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await apiClient.post("/users/signup", {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        password: String(password),
      });
      auth?.login?.(res.data);

      setMessage("Signup Success");
      setName("");
      setEmail("");
      setPassword("");

      const from = location.state?.from || "/profile";
      navigate(from);
    } catch (error) {
      const serverMsg = error?.response?.data?.message;
      setMessage(
        serverMsg ? `Signup Failed: ${serverMsg}` : "Signup Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Signup</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Create a strong password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="password-hint">
            Use at least 8 characters with a mix of letters and numbers.
          </p>
        </div>

        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="signup-footer">
        <p>
          Already have an account? <Link to="/login">Login Here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;