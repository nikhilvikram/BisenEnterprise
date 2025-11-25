import { useContext } from "react";
import { PostList } from "../store/post-list-store";

const Post = ({ post }) => {
  const { deletePost } = useContext(PostList);

  return (
    <div
      className="card shadow-lg border-0 post-card"
      style={{ width: "100%", maxWidth: "380px" }}
    >
      {/* Top Image */}
      <img
        src={post.image}
        alt={post.title}
        className="card-img-top"
        style={{
          height: "240px",
          objectFit: "cover",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      />

      <div className="card-body" style={{ color: "var(--text-color)" }}>
        {/* Name + Rating */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title fw-bold">{post.title}</h5>

          <span className="text-warning" style={{ fontSize: "1rem" }}>
            {"★".repeat(post.rating)}
            {"☆".repeat(5 - post.rating)}
          </span>
        </div>

        {/* Story */}
        <p className="card-text text-muted">{post.body}</p>

        {/* Tags */}
        <div className="tag-ribbon-box">
          {post.tags.map((tag, index) => (
            <span key={index} className="tag-ribbon">
              {tag}
            </span>
          ))}
        </div>

        {/* Reactions + Delete */}
        <div className="d-flex justify-content-between align-items-center">
          <span className="badge bg-danger px-3 py-2">❤️ {post.reactions}</span>

          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => deletePost(post.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
