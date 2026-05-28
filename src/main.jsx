import ReactDOM from "react-dom/client";
import App from "./App";
import "./sass/main.scss";
import CartProvider from "./context/CartProvider";
import AuthProvider from "./context/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
);
