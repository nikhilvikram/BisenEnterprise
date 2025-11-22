import { createContext, useReducer } from "react";

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

const DEFAULT_TEXTILE_LIST = [
  {
    id: 1,
    title: "Luktrima Women's Backless Top",
    price: 375,
    image: "https://m.media-amazon.com/images/I/51A-sD5jX8L._SX385_.jpg",
    category: "Topwear",
    rating: 4,
    reviews: 74,
    discount: 46,
    description:
      "Elegant backless design, perfect for parties and evening wear. Breathable stretch cotton fabric.",
  },
  {
    id: 2,
    title: "TIVANTE Sweetheart Crop Top",
    price: 298,
    image: "https://m.media-amazon.com/images/I/51A-sD5jX8L._SX385_.jpg",
    category: "Topwear",
    rating: 5,
    reviews: 9,
    discount: 70,
    description:
      "Soft georgette crop top with sweetheart neckline. Stylish fit for casual or festive outings.",
  },
];
export default TextileListProvider;
