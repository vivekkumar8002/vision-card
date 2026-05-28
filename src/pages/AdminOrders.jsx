import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import apiClient from "../utils/apiClient";
import formatPrice from "../utils/formatPrice";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
    apiClient
      .get("/orders")
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMessage("Failed to load orders"));
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <h2>Admin Orders</h2>
        <Link to="/admin">Back</Link>
      </div>

      {message && <p>{message}</p>}

      {!orders.length ? (
        <p>No orders</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {orders.map((o) => {
            const orderId = o?.id || o?.["_id"];
            const key = orderId || `${o?.userId || "order"}-${o?.createdAt || ""}`;
            return (
              <Link
                key={key}
                to={`/orders/${orderId || ""}`}
                style={{ border: "1px solid #ddd", padding: 12, textDecoration: "none" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>#{String(orderId).slice(-6)}</strong>
                  <span>{formatPrice(Number(o.totalPrice || 0))}</span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {o.userId} • {o.status} • {o.paymentStatus}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default AdminOrders;
