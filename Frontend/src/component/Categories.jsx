import { useNavigate } from "react-router-dom";
import saree1 from "../assets/saree1.jpg";
import saree2 from "../assets/saree2.jpg";
import saree10 from "../assets/saree10.jpg";
import jwellery from "../assets/jwellery.jpg";
import footeware from "../assets/footware.webp";
import bag from "../assets/bag.jpg";
import nightwear from "../assets/nightwear.jpeg";

const Categories = () => {
  const navigate = useNavigate();

  const categoryList = [
    {
      name: "Sarees",
      img: saree1,
      path: "/SareeList",
    },
    {
      name: "Kurtis",
      img: saree10,
      path: "/KurtaList",
    },
    {
      name: "Nightwear",
      img: nightwear,
      path: "/SareeList", // later replace with Nightwear page
    },
    {
      name: "Bags",
      img: bag,
      path: "/CreatePost",
    },
    {
      name: "Jewellery",
      img: jwellery,
      path: "/SareeList",
    },
    {
      name: "Footwear",
      img: footeware,
      path: "/SareeList",
    },
  ];

  return (
    <div className="container category-container">
      <h2 className="category-heading">Shop by Category</h2>

      <div className="category-grid">
        {categoryList.map((cat, index) => (
          <div
            key={index}
            className="category-card"
            onClick={() => navigate(cat.path)}
          >
            <img src={cat.img} alt={cat.name} className="category-img" />

            {/* Overlay Label */}
            <div className="category-label">{cat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
