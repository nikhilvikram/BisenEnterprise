import { useParams, useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import { TextileList } from "../store/textile-list-store";
import { CartContext } from "../store/cart-context";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../store/wishlistSlice";

const ProductDetail = () => {
  const { textileArray } = useContext(TextileList);
  const { id } = useParams();
  const navigate = useNavigate();
  const item = textileArray.find((p) => p.id.toString() === id);
  const { cart, dispatch } = useContext(CartContext);
  const handleAdd = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { productId: item.id },
    });
  };
  const dispatch1 = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((i) => i.id === item.id);

  if (!item) {
    return (
      <div className="text-center mt-5">
        <h3>No product found 😔</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ color: "var(--text-color)" }}>
      <div className="row">
        {/* Left side: large image */}
        <div className="col-md-5 text-center">
          <img
            src={item.image}
            alt={item.title}
            className="img-fluid rounded shadow"
          />
          <div className="mt-3 d-flex justify-content-center gap-2">
            <button className="btn btn-outline-primary" onClick={handleAdd}>
              Add to Cart 🛒
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                if (isInWishlist) {
                  dispatch1(removeFromWishlist(item.id));
                } else {
                  dispatch1(addToWishlist(item));
                }
              }}
            >
              {isInWishlist ? "❤️ Remove from Wishlist" : "🤍 Add to Wishlist"}
            </button>
          </div>
        </div>

        {/* Right side: product details */}
        <div className="col-md-7">
          <h3>{item.title}</h3>
          <p className="text-muted">{item.category}</p>
          <div className="mb-2">
            <span className="text-warning">
              {"★".repeat(item.rating)}
              {"☆".repeat(5 - item.rating)}
            </span>
            <span className="ms-2">({item.reviews} reviews)</span>
          </div>
          <h4 className="text-danger">₹{item.price}</h4>
          <p className="text-success">
            {item.discount}% off · FREE Delivery Tomorrow
          </p>
          <p className="mt-3">{item.description}</p>
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;
