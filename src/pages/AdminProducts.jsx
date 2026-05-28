import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import apiClient from "../utils/apiClient";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const load = () => {
    setMessage("");
    apiClient
      .get("/products")
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMessage("Failed to load products"));
  };

  useEffect(() => {
    load();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    setMessage("");
    const numericPrice = Number(price);
    if (!name || Number.isNaN(numericPrice)) {
      setMessage("Invalid input");
      return;
    }

    try {
      await apiClient.post("/products", {
        name,
        price: numericPrice,
        image,
        category,
      });
      setName("");
      setPrice("");
      setImage("");
      setCategory("");
      load();
      setMessage("Product added");
    } catch {
      setMessage("Add failed");
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <h2>Admin Products</h2>
        <Link to="/admin">Back</Link>
      </div>

      {message && <p>{message}</p>}

      <section style={{ border: "1px solid #ddd", padding: 12, marginBottom: 20 }}>
        <strong>Add Product</strong>
        <form onSubmit={addProduct} style={{ display: "grid", gap: 10, marginTop: 10, maxWidth: 420 }}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price (number)"
            required
          />
          <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="Image URL" />
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
          <button type="submit">Add</button>
        </form>
      </section>

      <section>
        <strong>Products</strong>
        {!products.length ? (
          <p>No products</p>
        ) : (
          <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
            {products.map((p) => {
              const productId = p?.id || p?.["_id"];
              const key = productId || p?.name || `${p?.category || "product"}-${p?.price || ""}`;
              return (
              <div key={key} style={{ border: "1px solid #ddd", padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                      {p.category} • {p.price}
                    </div>
                  </div>
                  {p.image ? <img src={p.image} alt={p.name} width="48" height="48" /> : null}
                </div>
              </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminProducts;
