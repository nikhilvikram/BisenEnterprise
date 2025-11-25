import { act, createContext, useReducer } from "react";
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

export const PostList = createContext({
  postList: [],
  addPost: () => {},
  deletePost: () => {},
});

const postListReducer = (currPostList, action) => {
  switch (action.type) {
    case "ADD_POST": {
      const newPost = action.payload;
      return [newPost, ...currPostList];
    }
    case "DELETE_POST": {
      const id = action.payload;
      return currPostList.filter((p) => p.id != id);
    }
    case "UPDATE_REACTION": {
      const { id, delta } = action.payload;
      return currPostList.map((p) =>
        p.id === id ? { ...p, reactions: p.reactions || 0 } : p
      );
    }
  }

  return currPostList;
};

const PostListProvider = ({ children }) => {
  const [postList, dispatchPostList] = useReducer(
    postListReducer,
    DEFAULT_POST_LIST
  );

  const addPost = (post) => {
    dispatchPostList({ type: "ADD_POST", payload: post });
  };
  const deletePost = (id) => {
    dispatchPostList({ type: "DELETE_POST", payload: id });
  };
  const updatePost = (id, delta) => {
    dispatchPostList({ type: "UPDATE_POST", payload: { id, delta } });
  };

  return (
    <PostList.Provider
      value={{
        postList,
        addPost,
        deletePost,
        updatePost,
      }}
    >
      {children}
    </PostList.Provider>
  );
};

const DEFAULT_POST_LIST = [
  {
    id: "1",
    name: "Priya Sharma",
    image: saree1,
    story:
      "I ordered a Jaipur saree for my engagement. The fabric quality was amazing and delivery was super fast!",
    rating: 5,
    tags: ["Jaipur Saree", "Engagement", "Premium Quality"],
  },
  {
    id: "2",
    name: "Anjali Verma",
    image: saree8,
    story:
      "Loved the Surat Kurtis collection! Stylish, comfortable, and exactly as shown in the pictures.",
    rating: 4,
    tags: ["Surat Kurti", "Comfort Wear", "Trusted Shopping"],
  },
  {
    id: "3",
    name: "Ritika Deshmukh",
    image: saree4,
    story:
      "Received my designer blouse within 2 days. Perfect fit. Really impressed with the service.",
    rating: 5,
    tags: ["Designer Blouse", "Fast Delivery", "Perfect Fit"],
  },
];

export default PostListProvider;
