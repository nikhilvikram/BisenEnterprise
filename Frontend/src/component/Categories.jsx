import React from "react";
import { useNavigate } from "react-router-dom";

// Importing Assets (Reusing existing ones for placeholders)
// You should add specific images for new categories later
import saree1 from "../assets/saree1.jpg";
import saree2 from "../assets/saree2.jpg";
import saree3 from "../assets/saree3.jpg";
import saree10 from "../assets/saree10.jpg";
import nightwear from "../assets/nightwear.jpeg";
import jwellery from "../assets/jwellery.jpg";
import bag from "../assets/bag.webp";
import footeware from "../assets/footware.webp";

// Placeholder for missing images (Use saree1 temporarily)
const placeholder = saree1;

const Categories = () => {
  const navigate = useNavigate();

  // --- ROBUST CATEGORY DATA STRUCTURE ---
  const sections = [
    {
      title: "🌟 Bisen Exclusive (Trending)",
      items: [
        {
          name: "Signature Sarees",
          desc: "Silk, Banarasi & Daily Wear",
          img1: saree1, // Best Product 1
          img2: saree2, // Best Product 2
          path: "/SareeList",
          size: "large", // Special Large Card
        },
        {
          name: "Ready-to-Wear Sarees",
          desc: "1-Minute Draping Saree",
          img1: saree3,
          img2: saree10,
          path: "/SareeList",
          size: "large",
        },
      ],
    },
    {
      title: "👗 Ethnic Suits & Sets",
      items: [
        {
          name: "Kurti Sets",
          desc: "Pant, Plazo & 3PC Sets",
          img1: saree10,
          img2: saree2,
          path: "/KurtaList",
        },
        {
          name: "Co-ord Sets",
          desc: "Modern Matching Sets",
          img1: saree3,
          img2: nightwear, // Replace with co-ord image
          path: "/SareeList",
        },
        {
          name: "Anarkali & Gowns",
          desc: "One Piece Party Wear",
          img1: saree1,
          img2: saree10,
          path: "/SareeList",
        },
        {
          name: "Lehenga Choli",
          desc: "Wedding & Festive",
          img1: saree2,
          img2: saree3,
          path: "/SareeList",
        },
      ],
    },
    {
      title: "👚 Saree Essentials (Must Haves)",
      items: [
        {
          name: "Readymade Blouses",
          desc: "Stretchable & Designer",
          img1: saree1, // Replace with blouse image
          img2: saree1,
          path: "/SareeList",
        },
        {
          name: "Saree Shapers",
          desc: "Shapewear Petticoats",
          img1: saree2, // Replace with shaper image
          img2: saree2,
          path: "/SareeList",
        },
        {
          name: "Dupattas",
          desc: "Heavy & Designer",
          img1: saree3,
          img2: saree3,
          path: "/SareeList",
        },
        {
          name: "Nauvari Sarees",
          desc: "Maharashtrian Tradition",
          img1: saree10,
          img2: saree1,
          path: "/SareeList",
        },
      ],
    },
    {
      title: "👜 Accessories & Lifestyle",
      items: [
        {
          name: "Designer Nightwear",
          desc: "Luxury Comfort",
          img1: nightwear,
          img2: nightwear,
          path: "/SareeList",
        },
        {
          name: "Western Dresses",
          desc: "Chic & Modern",
          img1: saree10,
          img2: saree2,
          path: "/SareeList",
        },
        {
          name: "Jewellery",
          desc: "Necklaces & Earrings",
          img1: jwellery,
          img2: jwellery,
          path: "/SareeList",
        },
        {
          name: "Bags & Footwear",
          desc: "Complete the Look",
          img1: bag,
          img2: footeware,
          path: "/SareeList",
        },
      ],
    },
  ];

  return (
    <div className="container category-page-wrapper">
      <h2 className="section-title">Shop By Category</h2>
      <p className="text-center text-muted mb-4">
        Handpicked collections for every occasion
      </p>

      {sections.map((section, secIndex) => (
        <div key={secIndex} className="category-section">
          <h3 className="category-section-title">{section.title}</h3>

          <div className="category-grid-robust">
            {section.items.map((cat, index) => (
              <div
                key={index}
                className={`category-card-robust ${
                  cat.size === "large" ? "span-2" : ""
                }`}
                onClick={() => navigate(cat.path)}
              >
                {/* SPLIT IMAGE CONTAINER */}
                <div className="cat-img-split">
                  <div className="cat-img-half">
                    <img src={cat.img1} alt={cat.name} />
                  </div>
                  <div className="cat-img-half">
                    <img src={cat.img2} alt={cat.name} />
                  </div>
                </div>

                {/* INFO OVERLAY */}
                <div className="cat-info-overlay">
                  <h4 className="cat-name">{cat.name}</h4>
                  <span className="cat-desc">{cat.desc}</span>
                  <span className="cat-arrow">Shop Now →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;
