import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TryOnAI from "./pages/TryOnAI";
import UnderConstruction from "./pages/UnderConstruction";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import OrderHistory from "./pages/OrderHistory";
import OrderDetails from "./pages/OrderDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminPortal from "./pages/AdminPortal";
import Assistant from "./pages/Assistant";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import ProductGallery from "./components/ProductGallery";
import ProductGalleryLayout from "./layout/ProductGalleryLayout";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";

function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ChatWidget />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/tryon" element={<TryOnAI />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/admin-portal" element={<AdminPortal />} />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />
          <Route
            path="/orders"
            element={
              <RequireAuth>
                <OrderHistory />
              </RequireAuth>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <RequireAuth>
                <OrderDetails />
              </RequireAuth>
            }
          />

          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <RequireAdmin>
                <AdminOrders />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/products"
            element={
              <RequireAdmin>
                <AdminProducts />
              </RequireAdmin>
            }
          />

          <Route path="/products" element={<ProductGalleryLayout />}>
            <Route index element={<ProductGallery categoryType="allProducts" />} />
            <Route
              path="eyeglasses"
              element={<ProductGallery categoryType="eyeglasses" />}
            />
            <Route
              path="sunglasses"
              element={<ProductGallery categoryType="sunglasses" />}
            />
            <Route path="eyeglasses/:productId" element={<ProductPage />} />
            <Route path="sunglasses/:productId" element={<ProductPage />} />
          </Route>

          <Route path="*" element={<UnderConstruction />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
