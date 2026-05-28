import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import apiClient from "../utils/apiClient";
import formatPrice from "../utils/formatPrice";

function OrderDetails() {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");

  const paymentSuccess = location.state?.paymentSuccess === true;

  useEffect(() => {
    setMessage("");
    apiClient
      .get(`/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(() => setMessage("Failed to load order"));
  }, [orderId]);

  return (
    <main className="order-container">
      <div className="order-header">
        <h2>Order Details</h2>
        <Link to="/orders" className="back-link">Back to orders</Link>
      </div>

      {paymentSuccess && (
        <div className="success-message" style={{ 
          padding: "16px", 
          backgroundColor: "#d4edda", 
          border: "1px solid #c3e6cb", 
          borderRadius: "4px", 
          color: "#155724",
          marginBottom: "20px"
        }}>
          ✅ Payment Successfully Completed!
        </div>
      )}

      {message && <p>{message}</p>}

      {!order ? null : (
        <div style={{ display: "grid", gap: 20 }}>
          <div className="order-card">
            <div>
              <strong>Order ID:</strong> {order.id || order["_id"]}
            </div>
            <div>
              <strong>Status:</strong> {order.status}
              <span className="badge status">{order.status}</span>
            </div>
            <div>
              <strong>Payment:</strong> {order.paymentStatus} ({order.paymentMethod})
              <span className={`badge ${order.paymentStatus === 'paid' ? 'paid' : 'unpaid'}`}>{order.paymentStatus}</span>
            </div>
            <div>
              <strong>Total:</strong> {formatPrice(Number(order.totalPrice || 0))}
            </div>
          </div>

          {order.shippingAddress && (
            <div className="order-card">
              <strong>Shipping Address</strong>
              <div style={{ fontSize: 13, marginTop: 6 }}>
                <div>{order.shippingAddress.fullName}</div>
                <div>{order.shippingAddress.phone}</div>
                <div>{order.shippingAddress.line1}</div>
                {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </div>
                <div>{order.shippingAddress.country}</div>
              </div>
            </div>
          )}

          <div className="order-card">
            <strong>Items</strong>
            <div style={{ marginTop: 10 }}>
              {(order.items || []).map((i) => (
                <div key={`${i.itemId}-${i.title}`} className="order-item">
                  {i.image ? (
                    <img src={i.image} alt={i.title} />
                  ) : (
                    <div style={{ width: 64, height: 64, background: "#eee" }} />
                  )}
                  <div className="details">
                    <div className="price">
                      {formatPrice(Number(i.price || 0))} × {i.quantity}
                    </div>
                  </div>
                  <div className="total">
                    {formatPrice(Number(i.price || 0) * Number(i.quantity || 0))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default OrderDetails;
