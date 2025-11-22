import { useSelector } from "react-redux";
const WishlistPage = () => {
  const items = useSelector((state) => state.wishlist.items);
  return (
    <div className="container mt-4">
      <h3>Your Wishlist</h3>
      <div className="row">
        {items.map((item) => (
          <div key={item.id} className="col-3">
            <img src={item.image} className="img-fluid" />
            <h5>{item.title}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};
export default WishlistPage;
