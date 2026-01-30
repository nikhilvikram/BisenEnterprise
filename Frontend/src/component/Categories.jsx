import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TextileList } from "../store/textile-list-store";
import { API_URL } from "../config";

// Imported Assets (Fallbacks)
import saree1 from "../assets/saree1.jpg";
import saree2 from "../assets/saree2.jpg";
import saree3 from "../assets/saree3.jpg";
import saree10 from "../assets/saree10.jpg";
import nightwear from "../assets/nightwear.jpeg";
// import jwellery from "../assets/jwellery.jpg";
// import bag from "../assets/bag.webp";
// import footeware from "../assets/footware.webp";

// Default placeholder if absolutely nothing is found
const DEFAULT_PLACEHOLDER = "https://via.placeholder.com/300?text=Coming+Soon";

const Categories = () => {
  const navigate = useNavigate();
  const { textileArray } = useContext(TextileList);

  // 1. HELPER: Fix Image URLs (S3 vs Local)
  const getImgSrc = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("data:")) return imagePath;
    const baseUrl = API_URL.replace("/api", "");
    return `${baseUrl}${imagePath}`;
  };

  // 🟢 2. FIXED DYNAMIC IMAGE FETCH
  const getDynamicImages = (path, fallbackImg1, fallbackImg2) => {
    // A. If no data at all, return fallbacks immediately
    if (!textileArray || textileArray.length === 0) {
      return { img1: fallbackImg1, img2: fallbackImg2 };
    }

    // B. Extract category name (e.g., "kurti set")
    const catSlug = path.split("/").pop();
    if (!catSlug) return { img1: fallbackImg1, img2: fallbackImg2 };

    const cleanCat = catSlug.replace(/_/g, " ").toLowerCase().trim();

    // C. Filter products matching this category
    const matchingProducts = textileArray.filter((p) => {
      const pCat = (p.category || "").replace(/_/g, " ").toLowerCase().trim();
      return pCat === cleanCat || pCat.includes(cleanCat);
    });

    // D. Extract Real Images
    let realImg1 =
      matchingProducts[0]?.images?.[0] || matchingProducts[0]?.image;
    let realImg2 =
      matchingProducts[1]?.images?.[0] ||
      matchingProducts[1]?.image ||
      matchingProducts[0]?.images?.[1];

    // E. Process URLs (Add http/localhost if needed)
    realImg1 = getImgSrc(realImg1);
    realImg2 = getImgSrc(realImg2);

    // 🟢 F. THE FIX: Logic Priority
    // 1. Real DB Image -> 2. Provided Fallback (saree1.jpg) -> 3. Generic Placeholder
    return {
      img1: realImg1 || fallbackImg1 || DEFAULT_PLACEHOLDER,
      img2: realImg2 || fallbackImg2 || fallbackImg1 || DEFAULT_PLACEHOLDER,
    };
  };

  const sections = [
    {
      title: "The Saree Collection",
      items: [
        {
          name: "Traditonal Sarees",
          desc: "Silk, Banarasi & Designer",
          path: "/category/Saree",
          default1: saree1,
          default2: saree2,
          size: "large",
        },
        {
          name: "Nauvari Sarees",
          desc: "Authentic Maharashtrian",
          path: "/category/Nauvari",
          default1: saree3,
          default2: saree10,
        },
        {
          name: "Ready-to-Wear",
          desc: "1-Minute Draping Saree",
          path: "/category/Ready-to-wear_Saree",
          default1: saree10,
          default2: saree1,
        },
      ],
    },
    {
      title: "Ethnic Suits & Dresses",
      items: [
        {
          name: "Kurti Sets",
          desc: "Pant, Plazo & 3PC Sets",
          path: "/category/Kurti_Set",
          default1: saree10,
          default2: saree2,
        },
        {
          name: "Anarkali Suits",
          desc: "Long Gowns & One Piece",
          path: "/category/Anarkali",
          default1: saree1,
          default2: saree10,
        },
        {
          name: "Lehenga Choli",
          desc: "Wedding & Festive",
          path: "/category/Lehenga",
          default1: saree2,
          default2: saree3,
        },
      ],
    },
    {
      title: "Modern & Western",
      items: [
        {
          name: "Co-ord Sets",
          desc: "Matching Top & Bottom",
          path: "/category/Co-ord_Set",
          default1: saree3,
          default2: nightwear,
        },
        {
          name: "Western Wear",
          desc: "Dresses & Gowns",
          path: "/category/Western",
          default1: saree10,
          default2: saree2,
        },
      ],
    },
    {
      title: "Essentials & Comfort",
      items: [
        {
          name: "Nightwear",
          desc: "Luxury Sleepwear",
          path: "/category/Nightwear",
          default1: nightwear,
          default2: nightwear,
        },
        {
          name: "Lingerie",
          desc: "Bra, Panty & Sets",
          path: "/category/Lingerie",
          default1: saree2,
          default2: saree3,
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
            {section.items.map((cat, index) => {
              const { img1, img2 } = getDynamicImages(
                cat.path,
                cat.default1,
                cat.default2,
              );

              return (
                <div
                  key={index}
                  className={`category-card-robust ${
                    cat.size === "large" ? "span-2" : ""
                  }`}
                  onClick={() => navigate(cat.path)}
                >
                  <div className="cat-img-split">
                    <div className="cat-img-half">
                      <img src={img1} alt={cat.name} loading="lazy" />
                    </div>
                    <div className="cat-img-half">
                      <img src={img2} alt={cat.name} loading="lazy" />
                    </div>
                  </div>

                  <div className="cat-info-overlay">
                    <h4 className="cat-name">{cat.name}</h4>
                    <span className="cat-desc">{cat.desc}</span>
                    <span className="cat-arrow">Shop Now →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;
