// Component responsible for fetching, displaying, and managing posts (CRUD)

import React, { useEffect, useState } from "react";
import { deletePosts, getPosts } from "../api/server";
import { toast } from "react-toastify";
import Form from "./Form";

const Posts = () => {
  // State to store all posts fetched from API
  const [posts, setPosts] = useState([]);

  // State to store post data when editing
  const [updateData, setUpdateData] = useState({});

  // Fetch posts from API
  const getPostsData = async () => {
    try {
      const res = await getPosts();
      setPosts(res.data); // Update state with API response
    } catch (error) {
      toast.error(error.message); // Show error if fetch fails
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    getPostsData();
  }, []);

  // Handle delete post by ID
  const handleDelete = async (id) => {
    try {
      const res = await deletePosts(id);

      if (res.status === 200) {
        // Update state to remove deleted post from UI
        setPosts((prev) => prev.filter((post) => post.id !== id));
        toast.success("Successfully Deleted");
      } else {
        toast.error(`Status: ${res.status}, Failed to delete`);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("Something went wrong while deleting");
    }
  };

  // Handle edit: populate form with selected post data
  const handleEdit = (currElm) => {
    setUpdateData(currElm);
  };

  return (
    <>
      {/* Form for adding or editing posts */}
      <section className="section-form">
        <Form
          setPosts={setPosts}
          updateData={updateData}
          setUpdateData={setUpdateData}
        />
      </section>

      {/* Display list of posts */}
      <section className="section-posts">
        <ol>
          {posts.map((currElm) => {
            const { id, title, body } = currElm;
            return (
              <li key={id}>
                {/* Post content */}
                <p>Title: {title}</p>
                <p>Body: {body}</p>

                {/* Action buttons */}
                <div>
                  <button onClick={() => handleEdit(currElm)}>Edit</button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
};

export default Posts;
