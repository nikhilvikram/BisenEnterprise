import React, { useState, useContext } from "react";
import { PostList } from "../store/post-list-store";

const CreatePost = () => {
  const { addPost } = useContext(PostList);

  // Local form state
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [success, setSuccess] = useState(false);
  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare post object (match your Post structure)
    const newPost = {
      id: crypto.randomUUID(), // unique id
      title,
      body,
      reactions: 0,
      userId: "user-1",
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== ""), // convert comma-separated string to array
    };

    // Add post to context
    addPost(newPost);

    // Clear form
    setTitle("");
    setBody("");
    setTags("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 200);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Create a New Post</h3>
      {success && (
        <div className="alert alert-success" role="alert">
          🎉 Post created successfully!
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="form-control"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Body Field */}
        <div className="mb-3">
          <label htmlFor="body" className="form-label">
            Body
          </label>
          <textarea
            id="body"
            className="form-control"
            rows="3"
            placeholder="Write your post content..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        {/* Tags Field */}
        <div className="mb-3">
          <label htmlFor="tags" className="form-label">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            type="text"
            className="form-control"
            placeholder="e.g. travel, pune, vacation"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Add Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
