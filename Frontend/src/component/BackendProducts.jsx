import React, { useEffect, useState } from "react";

const BackendProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // ✅ CORRECT (Smart Switching)
  const baseUrl =
    import.meta.env.MODE === "production"
      ? "https://bisenenterprise.onrender.com" // <--- Your Live Render Backend
      : "http://localhost:5000"; // <--- Your Local Testing
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${baseUrl}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching API:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <h3 className="mt-4">Fetching Products...</h3>;

  return (
    <div className="container mt-4">
      <h3>📦 Live Products from MongoDB</h3>
      <div className="row gy-4">
        {products.map((item) => (
          <div key={item._id} className="col-6 col-md-3">
            <div className="card shadow-sm p-2">
              <img
                src={`${item.images?.length > 0 ? item.images[0] : item.image}`}
                alt={item.title}
                className="img-fluid rounded"
              />
              <h6 className="mt-2">{item.title}</h6>
              <p className="text-danger fw-bold">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackendProducts;
