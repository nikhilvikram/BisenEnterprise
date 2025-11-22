import { useContext } from "react";
import { PostList } from "../store/post-list-store";

const Post = ({ post }) => {
  const { deletePost } = useContext(PostList);
  return (
    <>
      <div className="card post-card" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">
            {post.title}
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {post.reactions}
              <span class="visually-hidden">unread messages</span>
            </span>
          </h5>
          <p className="card-text">{post.body}</p>
          <button
            className="btn btn-sm btn-outline-danger mt-2"
            onClick={() => deletePost(post.id)}
          >
            Delete
          </button>
          {post.tags.map((tag) => (
            <span class="badge text-bg-primary hashtag">{tag}</span>
          ))}
        </div>
      </div>
    </>
  );
};
export default Post;
