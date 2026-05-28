import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

function Assistant() {
  const createId = () =>
    globalThis.crypto?.randomUUID
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { id: "welcome", role: "assistant", text: "Hi! Main aapka Eyewear assistant hoon. Aap kya dhoondh rahe ho?" },
  ]);

  const reply = useMemo(
    () => (text) => {
      const t = String(text || "").toLowerCase();
      if (t.includes("try") || t.includes("tryon") || t.includes("camera")) {
        return "Try On ke liye Try On page open karo aur camera start karo. Wahan face shape demo bhi hai.";
      }
      if (t.includes("order") || t.includes("history")) {
        return "Order history dekhne ke liye Profile → Order History jao. Checkout me Pay Demo karke order place hota hai.";
      }
      if (t.includes("login") || t.includes("register") || t.includes("signup")) {
        return "Login/Register ke liye Login/Signup page use karo. Login ke baad Profile me address save kar sakte ho.";
      }
      if (t.includes("sunglass") || t.includes("sun")) {
        return "Sunglasses collection /products/sunglasses me hai. Aapko classic ya modern style chahiye?";
      }
      if (t.includes("eyeglass") || t.includes("glass")) {
        return "Eyeglasses collection /products/eyeglasses me hai. Aapka face shape kya hai (round/oval/square)?";
      }
      return "Aap collection browse kar sakte ho /products me. Aapko eyeglasses chahiye ya sunglasses?";
    },
    [],
  );

  const send = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: createId(), role: "user", text },
      { id: createId(), role: "assistant", text: reply(text) },
    ]);
    setInput("");
  };

  return (
    <main style={{ padding: 20, maxWidth: 820, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <h2>AI Chat Assistant (Demo)</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/products">Products</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </div>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, height: 420, overflow: "auto" }}>
        {messages.map((m) => (
          <div
            key={m.id}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "10px 12px",
                borderRadius: 10,
                background: m.role === "user" ? "#111" : "#f2f2f2",
                color: m.role === "user" ? "#fff" : "#000",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={send} style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message..."
          style={{ flex: 1, padding: 10 }}
        />
        <button type="submit">Send</button>
      </form>
    </main>
  );
}

export default Assistant;
