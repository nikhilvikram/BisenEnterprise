import { act, createContext, useReducer } from "react";

export const PostList = createContext({
  postList: [],
  addPost: () => {},
  deletePost: () => {},
});

const postListReducer = (currPostList, action) => {
  switch (action.type) {
    case "ADD_POST": {
      const newPost = action.payload;
      return  [newPost,...currPostList]
    }
    case "DELETE_POST": {
      const id = action.payload;
      return currPostList.filter((p) => p.id != id);
    }
        case "UPDATE_REACTION": {
      const {id, delta} = action.payload;
      return currPostList.map(p =>p.id === id? { ...p, reactions: (p.reactions || 0)}:p);
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
    dispatchPostList({type:"ADD_POST",payload:post});
  };
  const deletePost = (id) => {
    dispatchPostList({type:"DELETE_POST",payload:id})
  };
  const updatePost =(id,delta) =>{
    dispatchPostList({type:"UPDATE_POST",payload:{id,delta}});
  }

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
    title: "Go to Pune",
    body: "Hellow Pune is a sex city yammette",
    reactions: 2,
    userId: "user-9",
    tags: ["vacation", "pune", "sex"],
  },
  {
    id: "2",
    title: "Got laid",
    body: "I did try to aproach and I am in heaven now",
    reactions: 10,
    userId: "user-14",
    tags: ["aproach", "heaven"],
  },
];

export default PostListProvider;
