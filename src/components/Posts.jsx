// Component responsible for fetching, displaying and managing posts (CRUD)

import React, { useEffect, useState } from "react";
import { deletePosts, getPosts } from "../api/server";
import { toast } from "react-toastify";
import Form from "./Form";

const Posts = () => {
  // State to store all posts
  const [posts, setPosts] = useState([]);

  // Fetch posts from API
  const getPostsData = async () => {
    try {
      const res = await getPosts();

      // Update state with API response
      setPosts(res.data);
    } catch (error) {
      // Handle API error
      toast.error(error.message);
    }
  };

  // Load posts on component mount
  useEffect(() => {
    getPostsData();
  }, []);

  // Handle delete post
  const handleDelete = async (id) => {
    try {
      const res = await deletePosts(id);

      // If delete successful, update UI
      if (res.status === 200) {
        setPosts((prev) => prev.filter((post) => post.id !== id));
        toast.success("Successfully Deleted");
      } else {
        toast.error(`Status: ${res.status}, Failed to delete`);
      }
    } catch (error) {
      // Handle error
      console.log(error.message);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {/* Form for adding new post */}
      <section className="section-form">
        <Form setPosts={setPosts} />
      </section>

      {/* Posts list */}
      <section className="section-posts">
        <ol>
          {posts.map(({ id, title, body }) => (
            <li key={id}>
              {/* Post content */}
              <p>Title: {title}</p>
              <p>Body: {body}</p>

              {/* Action buttons */}
              <div>
                <button>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
};

export default Posts;
