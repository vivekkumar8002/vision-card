import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";
import apiClient from "../utils/apiClient";

const emptyAddress = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

function Profile() {
  const auth = useContext(AuthContext);
  const [cart] = useContext(CartContext);

  const initialAddress = useMemo(() => auth?.user?.defaultAddress || emptyAddress, [auth?.user]);
  const [name, setName] = useState(auth?.user?.name || "");
  const [address, setAddress] = useState(initialAddress);
  const [message, setMessage] = useState("");

  const onChange = (key) => (e) => {
    setAddress((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await apiClient.put("/users/me", {
        name,
        defaultAddress: address,
      });
      auth?.setUser?.(res.data);
      setMessage("Profile updated");
    } catch {
      setMessage("Profile update failed");
    }
  };

  const logout = () => {
    auth?.logout?.();
  };

  return (
    <main style={{ padding: 20 }}>
      <h2>Profile</h2>

      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        <section style={{ minWidth: 280 }}>
          <h3>Account</h3>
          <div>Email: {auth?.user?.email}</div>
          <div style={{ marginTop: 10 }}>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </div>
          <div style={{ marginTop: 20, display: "grid", gap: 8 }}>
            <Link to="/cart">Saved Cart ({cart?.length || 0})</Link>
            <Link to="/orders">Order History</Link>
            <Link to="/assistant">AI Chat Assistant</Link>
            <Link to="/tryon">Try On</Link>
            {auth?.user?.isAdmin && <Link to="/admin">Admin Dashboard</Link>}
          </div>
        </section>

        <section style={{ minWidth: 320, flex: 1 }}>
          <h3>Default Address</h3>
          {message && <p>{message}</p>}
          <form onSubmit={saveProfile} style={{ display: "grid", gap: 10 }}>
            <input
              type="text"
              value={name}
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="text"
              value={address.fullName}
              placeholder="Full Name"
              onChange={onChange("fullName")}
            />
            <input
              type="text"
              value={address.phone}
              placeholder="Phone"
              onChange={onChange("phone")}
            />
            <input
              type="text"
              value={address.line1}
              placeholder="Address Line 1"
              onChange={onChange("line1")}
            />
            <input
              type="text"
              value={address.line2}
              placeholder="Address Line 2"
              onChange={onChange("line2")}
            />
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                type="text"
                value={address.city}
                placeholder="City"
                onChange={onChange("city")}
              />
              <input
                type="text"
                value={address.state}
                placeholder="State"
                onChange={onChange("state")}
              />
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                type="text"
                value={address.postalCode}
                placeholder="Postal Code"
                onChange={onChange("postalCode")}
              />
              <input
                type="text"
                value={address.country}
                placeholder="Country"
                onChange={onChange("country")}
              />
            </div>

            <button type="submit">Save</button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Profile;
