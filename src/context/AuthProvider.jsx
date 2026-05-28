import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import apiClient from "../utils/apiClient";
import AuthContext from "./AuthContext";

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("esUser");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("esToken") || "");

  useEffect(() => {
    if (token) localStorage.setItem("esToken", token);
    else localStorage.removeItem("esToken");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("esUser", JSON.stringify(user));
    else localStorage.removeItem("esUser");
  }, [user]);

  useEffect(() => {
    if (!token) return;
    apiClient
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        setToken("");
        setUser(null);
      });
  }, [token]);

  const login = ({ token: nextToken, user: nextUser }) => {
    setToken(nextToken || "");
    setUser(nextUser || null);
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
      setUser,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
