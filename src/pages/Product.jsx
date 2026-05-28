import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    apiClient.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <h2>Products</h2>

      {products.map((p) => {
        const { _id: id, name, price } = p;
        return (
          <div key={id}>
            <h3>{name}</h3>
            <p>₹{price}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Products;
