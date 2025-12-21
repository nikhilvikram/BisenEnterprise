import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const TextileList = createContext({
  textileArray: [],
  // ... addIteam, deleteIteam placeholders ...
});

const TextileListProvider = ({ children }) => {
  const [textileArray, setTextileArray] = useState([]);
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  // FETCH REAL PRODUCTS FROM MONGODB
  useEffect(() => {
    console.log("🔌 Fetching from:", baseUrl);
    axios
      .get(`${baseUrl}/products`)
      .then((res) => {
        setTextileArray(res.data); // These items have real _id like "654..."
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <TextileList.Provider value={{ textileArray }}>
      {children}
    </TextileList.Provider>
  );
};

export default TextileListProvider;
