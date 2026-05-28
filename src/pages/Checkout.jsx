import { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import CartContext from "../context/CartContext";
import { allProductsData } from "../data/productData";
import formatPrice from "../utils/formatPrice";
import parsePrice from "../utils/parsePrice";
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

function Checkout() {
  const auth = useContext(AuthContext);
  const [cart, setCart] = useContext(CartContext);
  const navigate = useNavigate();

  const items = useMemo(() => {
    const products = Array.isArray(allProductsData) ? allProductsData : [];
    return (cart || [])
      .map((ci) => {
        const p = products.find((x) => x.id === ci.itemId);
        if (!p) return null;
        const priceNumber = parsePrice(p.price);
        return {
          itemId: p.id,
          title: p.title,
          priceNumber,
          priceLabel: p.price,
          quantity: Number(ci.quantity || 0),
          image: p.images?.main || "",
        };
      })
      .filter(Boolean)
      .filter((i) => i.quantity > 0);
  }, [cart]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.priceNumber * i.quantity, 0),
    [items],
  );

  const shippingFee = 0;
  const tax = 0;
  const total = subtotal + shippingFee + tax;

  const [address, setAddress] = useState(auth?.user?.defaultAddress || emptyAddress);
  const [message, setMessage] = useState("");
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("demo");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const onChange = (key) => (e) => {
    setAddress((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const luhnCheck = (num) => {
    const s = String(num).replace(/\D/g, "");
    if (!s) return false;
    let sum = 0;
    let flip = false;
    for (let i = s.length - 1; i >= 0; i -= 1) {
      let n = Number(s[i]);
      if (flip) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      flip = !flip;
    }
    return sum % 10 === 0;
  };

  const validExpiry = (exp) => {
    const m = String(exp).trim().match(/^(\d{2})[\/\-](\d{2})$/);
    if (!m) return false;
    const mm = Number(m[1]);
    const yy = Number(m[2]);
    if (mm < 1 || mm > 12) return false;
    const year = 2000 + yy;
    const now = new Date();
    const end = new Date(year, mm, 0);
    return end >= new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setMessage("");
    setPaying(true);

    if (!items.length) {
      setMessage("Cart is empty");
      setPaying(false);
      return;
    }

    try {
      const demo = paymentMethod === "demo";
      const byCard = paymentMethod === "card";

      if (byCard) {
        if (!cardName.trim()) throw new Error("Enter name on card");
        if (!luhnCheck(cardNumber)) throw new Error("Invalid card number");
        if (!validExpiry(cardExpiry)) throw new Error("Invalid expiry (MM/YY)");
        if (!/^\d{3,4}$/.test(String(cardCvv))) throw new Error("Invalid CVV");
      }

      const transactionId = `${paymentMethod}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
      const res = await apiClient.post("/orders", {
        items: items.map((i) => ({
          itemId: i.itemId,
          title: i.title,
          price: i.priceNumber,
          quantity: i.quantity,
          image: i.image,
        })),
        shippingAddress: address,
        subtotal,
        shippingFee,
        tax,
        totalPrice: total,
        paymentMethod,
        paymentStatus: demo || byCard ? "paid" : "unpaid",
        transactionId,
      });

      setCart([]);
      const orderId = res?.data?.id || res?.data?.["_id"];
      navigate(`/orders/${orderId || ""}`, { state: { paymentSuccess: true } });
    } catch (err) {
      setMessage(err?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <main className="checkout-container">
      <div className="checkout-header">
        <h2>Checkout</h2>
      </div>
      
      {message && <div className={`checkout-message ${message.toLowerCase().includes('error') || message.toLowerCase().includes('fail') || message.toLowerCase().includes('invalid') ? 'error' : 'success'}`}>{message}</div>}

      {!items.length ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/products">Shop products</Link>
        </div>
      ) : (
        <div className="checkout-content">
          <section className="checkout-form-section">
            <div className="form-card">
              <h3>Shipping Address</h3>
              <form onSubmit={placeOrder} className="form-grid">
                <input
                  type="text"
                  className="form-input"
                  value={address.fullName}
                  placeholder="Full Name"
                  onChange={onChange("fullName")}
                  required
                />
                <input
                  type="text"
                  className="form-input"
                  value={address.phone}
                  placeholder="Phone"
                  onChange={onChange("phone")}
                  required
                />
                <input
                  type="text"
                  className="form-input"
                  value={address.line1}
                  placeholder="Address Line 1"
                  onChange={onChange("line1")}
                  required
                />
                <input
                  type="text"
                  className="form-input"
                  value={address.line2}
                  placeholder="Address Line 2"
                  onChange={onChange("line2")}
                />
                <div className="form-row">
                  <input
                    type="text"
                    className="form-input"
                    value={address.city}
                    placeholder="City"
                    onChange={onChange("city")}
                    required
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={address.state}
                    placeholder="State"
                    onChange={onChange("state")}
                    required
                  />
                </div>
                <div className="form-row">
                  <input
                    type="text"
                    className="form-input"
                    value={address.postalCode}
                    placeholder="Postal Code"
                    onChange={onChange("postalCode")}
                    required
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={address.country}
                    placeholder="Country"
                    onChange={onChange("country")}
                    required
                  />
                </div>

                <div className="payment-section">
                  <h3>Payment Method</h3>
                  <div className="payment-methods-grid">
                    <label className="payment-method-card">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="demo"
                        checked={paymentMethod === "demo"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-card-content">
                        <span className="payment-icon">⚡</span>
                        <span className="payment-label">Demo</span>
                      </div>
                    </label>
                    <label className="payment-method-card">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-card-content">
                        <span className="payment-icon">💵</span>
                        <span className="payment-label">Cash on Delivery</span>
                      </div>
                    </label>
                    <label className="payment-method-card">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={paymentMethod === "upi"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-card-content">
                        <span className="payment-icon">📱</span>
                        <span className="payment-label">UPI</span>
                      </div>
                    </label>
                    <label className="payment-method-card">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-card-content">
                        <span className="payment-icon">💳</span>
                        <span className="payment-label">Card</span>
                      </div>
                    </label>
                    <label className="payment-method-card">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={paymentMethod === "paypal"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-card-content">
                        <span className="payment-icon">🅿️</span>
                        <span className="payment-label">PayPal</span>
                      </div>
                    </label>
                  </div>
                  
                  {paymentMethod !== "demo" && paymentMethod !== "cod" && (
                    <div className="payment-info-box info">
                      Payment will be created as unpaid. Integrate a gateway to capture payment.
                    </div>
                  )}
                  {paymentMethod === "cod" && (
                    <div className="payment-info-box cod">
                      Pay in cash upon delivery. Order will be marked unpaid until delivery.
                    </div>
                  )}
                  {paymentMethod === "card" && (
                    <div className="card-details-form">
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Name on card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Card number (#### #### #### ####)"
                        inputMode="numeric"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                      <div className="card-row">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Expiry (MM/YY)"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          required
                        />
                        <input
                          type="text"
                          className="form-input"
                          placeholder="CVV"
                          inputMode="numeric"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          required
                        />
                      </div>
                      <div className="payment-info-box warning">
                        This is a demo card flow running locally. Do not use real card details.
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="checkout-button" disabled={paying}>
                  {paying ? "Processing..." : "Place Order"}
                </button>
                <div>
                  <Link to="/cart" className="back-link">← Back to cart</Link>
                </div>
              </form>
            </div>
          </section>

          <section className="checkout-summary-section">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {items.map((i) => (
                  <div
                    key={`${i.itemId}-summary`}
                    className="summary-item"
                  >
                    {i.image ? (
                      <img src={i.image} alt={i.title} />
                    ) : (
                      <div style={{ width: 60, height: 60, background: "#eee", borderRadius: 8 }} />
                    )}
                    <div className="item-details">
                      <div className="item-price">
                        {i.priceLabel} × {i.quantity}
                      </div>
                    </div>
                    <div className="item-total">{formatPrice(i.priceNumber * i.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{formatPrice(shippingFee)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="user-info">
                Logged in as {auth?.user?.email}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Checkout;
