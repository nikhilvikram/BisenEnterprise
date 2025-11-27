import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TextileList } from "../store/textile-list-store";

const SareeList = ({ products }) => {
  const { textileArray, deleteIteam } = useContext(TextileList);
  const navigate = useNavigate();
  return (
    <div className="container mt-4">
      <h3 className="mb-4">Textile Collection</h3>

      <div className="row g-4">
        {textileArray.map((item) => (
          <div
            key={item.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3"
            style={{ color: "var(--text-color)" }}
          >
            <div className="card h-100 shadow-sm">
              <img
                src={item.image}
                className="card-img-top"
                alt={item.title}
                style={{ objectFit: "cover", height: "260px" }}
                onClick={() => {
                  navigate(`/product/${item.id}`);
                }}
              />

              <div className="card-body">
                <h6 className="mb-1">{item.category}</h6>
                <h5 className="card-title" style={{ fontSize: "1rem" }}>
                  {item.title}
                </h5>

                <div className="mb-2">
                  {"⭐".repeat(item.rating)} <span>({item.reviews})</span>
                </div>

                <div className="mb-2">
                  <span className="fw-bold fs-5">₹{item.price}</span>{" "}
                  <span className="text-decoration-line-through">
                    ₹{Math.round(item.price / (1 - item.discount / 100))}
                  </span>{" "}
                  <span className="text-success fw-semibold">
                    ({item.discount}% off)
                  </span>
                </div>

                <button
                  className="btn btn-outline-danger w-100"
                  onClick={() => deleteIteam(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SareeList;
