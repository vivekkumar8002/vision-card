import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("esChat");
      return raw ? JSON.parse(raw) : [{ id: "welcome", role: "assistant", text: "Hi! Main aapka Eyewear assistant hoon. Aap kya dhoondh rahe ho?" }];
    } catch {
      return [{ id: "welcome", role: "assistant", text: "Hi! Main aapka Eyewear assistant hoon. Aap kya dhoondh rahe ho?" }];
    }
  });

  useEffect(() => {
    localStorage.setItem("esChat", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const onToggle = () => setOpen((prev) => !prev);
    const onOpen = () => setOpen(true);
    const onClose = () => setOpen(false);
    window.addEventListener("es-chat-toggle", onToggle);
    window.addEventListener("es-chat-open", onOpen);
    window.addEventListener("es-chat-close", onClose);
    return () => {
      window.removeEventListener("es-chat-toggle", onToggle);
      window.removeEventListener("es-chat-open", onOpen);
      window.removeEventListener("es-chat-close", onClose);
    };
  }, []);

  const createId = () =>
    globalThis.crypto?.randomUUID
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(16).slice(2)}`;

  const reply = useMemo(
    () => (text) => {
      const t = String(text || "").toLowerCase();
      if (t.includes("try") || t.includes("tryon") || t.includes("camera")) {
        return "Try On ke liye Try On page open karo aur camera start karo. Wahan advanced face detection bhi available hai.";
      }
      if (t.includes("order") || t.includes("history")) {
        return "Order history dekhne ke liye Profile → Order History jao. Checkout me Pay Demo karke order place hota hai.";
      }
      if (t.includes("login") || t.includes("register") || t.includes("signup")) {
        return "Login/Register ke liye Login/Signup page use karo. Login ke baad Profile me address save kar sakte ho.";
      }
      if (t.includes("admin") || t.includes("dashboard")) {
        return "Admin Dashboard dekhne ke liye Profile se Admin Dashboard kholein. Orders aur Products manage karein.";
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

  if (!open) {
    return (
      <button
        type="button"
        aria-label="Open Chat"
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          borderRadius: "50%",
          width: 56,
          height: 56,
          border: "none",
          background: "#111",
          color: "#fff",
          fontWeight: 700,
          boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
          cursor: "pointer",
          zIndex: 9999,
        }}
      >
        Chat
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Storefront Chat Assistant"
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        width: 360,
        maxWidth: "calc(100% - 40px)",
        height: 520,
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: 12,
        boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 9999,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 10, borderBottom: "1px solid #eee" }}>
        <strong>AI Chat Assistant</strong>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/assistant">Full Page</Link>
          <button type="button" onClick={() => setOpen(false)} style={{ border: "none", background: "transparent", cursor: "pointer" }}>
            ✕
          </button>
        </div>
      </div>
      <div style={{ padding: 10, flex: 1, overflow: "auto" }}>
        {messages.map((m) => (
          <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div
              style={{
                maxWidth: "85%",
                padding: "10px 12px",
                borderRadius: 10,
                background: m.role === "user" ? "#111" : "#f2f2f2",
                color: m.role === "user" ? "#fff" : "#000",
                whiteSpace: "pre-wrap",
                fontSize: 14,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={send} style={{ display: "flex", gap: 8, padding: 10, borderTop: "1px solid #eee" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message..."
          style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button type="submit" style={{ padding: "8px 12px" }}>Send</button>
      </form>
    </div>
  );
}

export default ChatWidget;
