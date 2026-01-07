import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const TextileList = createContext({
  textileArray: [],
  // ... addIteam, deleteIteam placeholders ...
});
import { API_URL } from "../config";
const TextileListProvider = ({ children }) => {
  const [textileArray, setTextileArray] = useState([]);
  // ✅ CORRECT (Smart Switching)
  // const API_URL =
  //   import.meta.env.MODE === "production"
  //     ? "https://bisenenterprise.onrender.com/api" // <--- Your Live Render Backend
  //     : "http://localhost:5000/api"; // <--- Your Local Testing
  // // FETCH REAL PRODUCTS FROM MONGODB
  useEffect(() => {
    console.log("🔌 Fetching from:", API_URL);
    axios
      .get(`${API_URL}/products`)
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
