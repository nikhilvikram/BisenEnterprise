import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist } from "../store/wishlistSlice"; // adjust path as needed
import { NavLink } from "react-router-dom";

const WishlistPage = () => {
  const items = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="empty-wishlist-container">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
          alt="Empty Wishlist"
          className="empty-wishlist-img"
        />
        <h3>Your Wishlist is Empty</h3>
        <p className="text-muted">
          Add items you love — they will appear here ❤️
        </p>
      </div>
    );
  }

  return (
    <div className="wishlist-wrapper">
      <h3 className="wishlist-title">Your Wishlist</h3>

      <div className="wishlist-grid">
        {items.map((item) => (
          <div key={item.id} className="wishlist-card">
            {/* IMAGE */}
            <NavLink to={`/product/${item.id}`}>
              <img src={item.image} alt={item.title} className="wishlist-img" />
            </NavLink>

            {/* CONTENT */}
            <div className="wishlist-info">
              <h5 className="wishlist-title-text">{item.title}</h5>
              <p className="wishlist-price">₹{item.price}</p>
            </div>

            {/* REMOVE BUTTON */}
            <button
              className="wishlist-remove-btn"
              onClick={() => dispatch(removeFromWishlist(item.id))}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
