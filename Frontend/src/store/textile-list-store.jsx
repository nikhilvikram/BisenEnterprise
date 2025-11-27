import { createContext, useReducer } from "react";
import saree1 from "../assets/saree1.jpg";
import saree2 from "../assets/saree2.jpg";
import saree3 from "../assets/saree3.jpg";
import saree4 from "../assets/saree4.jpg";
import saree5 from "../assets/saree5.jpg";
import saree6 from "../assets/saree6.jpg";
import saree7 from "../assets/saree7.jpg";
import saree8 from "../assets/saree8.jpg";
import saree9 from "../assets/saree9.jpg";
import saree10 from "../assets/saree10.jpg";
export const TextileList = createContext({
  textileArray: [],
  addIteam: () => {},
  deleteIteam: () => {},
  updateIteam: () => {},
});

const textileListReducer = (currTextileList, action) => {
  switch (action.type) {
    case "ADD_ITEAM": {
      const newIteam = action.payload;
      return [newIteam, ...currTextileList];
    }
    case "DELETE_ITEAM": {
      const id = action.payload;
      return currTextileList.filter((p) => p.id != id);
    }
    case "UPDATE_ITEAM": {
    }
  }
  return currTextileList;
};
const TextileListProvider = ({ children }) => {
  const [textileArray, dispatchTextileList] = useReducer(
    textileListReducer,
    DEFAULT_TEXTILE_LIST
  );
  const addIteam = (textile) => {
    dispatchTextileList({ type: "ADD_ITEAM", payload: textile });
  };
  const deleteIteam = (id) => {
    dispatchTextileList({ type: "DELETE_ITEAM", payload: id });
  };

  

  return (
    <TextileList.Provider value={{ textileArray, addIteam, deleteIteam }}>
      {children}
    </TextileList.Provider>
  );
};

export const DEFAULT_TEXTILE_LIST = [
  {
    id: 1,
    title: "Jaipuri Zari Silk Saree",
    price: 1499,
    image: saree1,
    category: "Saree",
    rating: 4.6,
    reviews: 320,
    discount: 40,
    description:
      "Premium Jaipuri zari silk saree with rich border work. Perfect for weddings and festive celebrations.",
  },
  {
    id: 2,
    title: "Banarasi Kanjivaram Saree",
    price: 2199,
    image: saree2,
    category: "Saree",
    rating: 4.8,
    reviews: 540,
    discount: 35,
    description:
      "Traditional Banarasi Kanjivaram saree with golden threads and soft silk fabric. Elegant & timeless.",
  },
  {
    id: 3,
    title: "Soft Lichi Silk Designer Saree",
    price: 1299,
    image: saree3,
    category: "Saree",
    rating: 4.4,
    reviews: 245,
    discount: 45,
    description:
      "Beautiful soft lichi silk saree with contrast pallu. Lightweight & perfect for all-day wear.",
  },
  {
    id: 4,
    title: "Rich Pallu Weaving Saree",
    price: 1699,
    image: saree4,
    category: "Saree",
    rating: 4.7,
    reviews: 610,
    discount: 50,
    description:
      "Exclusive weaving saree with rich pallu detailing. A premium choice for festivals and special occasions.",
  },
  {
    id: 5,
    title: "Rayon Printed Daily Wear Saree",
    price: 599,
    image: saree5,
    category: "Saree",
    rating: 4.2,
    reviews: 190,
    discount: 30,
    description:
      "Soft rayon printed saree ideal for office & daily usage. Light, comfortable and stylish.",
  },
  {
    id: 6,
    title: "Traditional Bandhani Saree",
    price: 799,
    image: saree6,
    category: "Saree",
    rating: 4.3,
    reviews: 155,
    discount: 35,
    description:
      "Classic Gujarati bandhani saree with vibrant colors. Suitable for festivals & cultural events.",
  },
  {
    id: 7,
    title: "Designer Embroidery Saree",
    price: 1899,
    image: saree7,
    category: "Saree",
    rating: 4.5,
    reviews: 410,
    discount: 38,
    description:
      "Heavy embroidery saree with stonework border. A perfect party wear saree.",
  },
  {
    id: 8,
    title: "Cotton Linen Summer Saree",
    price: 999,
    image: saree8,
    category: "Saree",
    rating: 4.1,
    reviews: 130,
    discount: 25,
    description:
      "Breathable cotton-linen saree for summer. Soft pastel shades with minimalist patterns.",
  },
  {
    id: 9,
    title: "Soft Organza Designer Saree",
    price: 1599,
    image: saree9,
    category: "Saree",
    rating: 4.6,
    reviews: 380,
    discount: 42,
    description:
      "Elegant organza saree with floral prints and satin border. Lightweight & premium look.",
  },
  {
    id: 10,
    title: "Wedding Premium Silk Saree",
    price: 2499,
    image: saree10,
    category: "Saree",
    rating: 4.9,
    reviews: 690,
    discount: 33,
    description:
      "Royal premium silk saree designed for weddings. Rich golden weaving with luxurious texture.",
  },
];

export default TextileListProvider;
