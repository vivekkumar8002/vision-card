import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../utils/apiClient";

function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, products: 0, revenue: 0 });
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
    Promise.all([apiClient.get("/orders"), apiClient.get("/products")])
      .then(([ordersRes, productsRes]) => {
        const orders = Array.isArray(ordersRes.data) ? ordersRes.data : [];
        const products = Array.isArray(productsRes.data) ? productsRes.data : [];
        const revenue = orders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
        setStats({ orders: orders.length, products: products.length, revenue });
      })
      .catch(() => setMessage("Failed to load dashboard stats"));
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>
      {message && <p>{message}</p>}
      <section style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, minWidth: 180 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Total Orders</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.orders}</div>
        </div>
        <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, minWidth: 180 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Products</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.products}</div>
        </div>
        <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, minWidth: 180 }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Revenue (demo)</div>
          <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.revenue.toFixed(2)}</div>
        </div>
      </section>
      <div style={{ display: "grid", gap: 10 }}>
        <Link to="/admin/orders">Manage Orders</Link>
        <Link to="/admin/products">Manage Products</Link>
        <Link to="/profile">Back to Profile</Link>
      </div>
    </main>
  );
}

export default AdminDashboard;
