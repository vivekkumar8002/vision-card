import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import apiClient from "../utils/apiClient";
import formatPrice from "../utils/formatPrice";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
    apiClient
      .get("/orders/my")
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMessage("Failed to load orders"));
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h2>Order History</h2>
      {message && <p>{message}</p>}

      {!orders.length ? (
        <div>
          <p>No orders yet.</p>
          <Link to="/products">Shop products</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {orders.map((o) => {
            const orderId = o?.id || o?.["_id"];
            const key = orderId || `${o?.status || "order"}-${o?.createdAt || ""}`;
            return (
              <Link
                key={key}
                to={`/orders/${orderId || ""}`}
                style={{
                  border: "1px solid #ddd",
                  padding: 12,
                  textDecoration: "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>Order #{String(orderId).slice(-6)}</strong>
                  <span>{formatPrice(Number(o.totalPrice || 0))}</span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  Status: {o.status} • Payment: {o.paymentStatus}
                </div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  {o.createdAt ? new Date(o.createdAt).toLocaleString() : ""}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default OrderHistory;
