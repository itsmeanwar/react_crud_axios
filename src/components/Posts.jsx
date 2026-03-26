// ------------------------------------------------------
// Posts Component
// Handles:
// 1. Fetching posts
// 2. Displaying posts
// 3. Edit & Delete actions
// 4. Disable buttons during edit mode
// ------------------------------------------------------

import React, { useEffect, useState } from "react";
import { deletePosts, getPosts } from "../api/server";
import { toast } from "react-toastify";
import Form from "./Form";

const Posts = () => {
  // Store posts
  const [posts, setPosts] = useState([]);

  // Store selected post for editing
  const [updateData, setUpdateData] = useState({});

  // Detect edit mode
  const isEditing = Object.keys(updateData).length !== 0;

  // ------------------------------------------------------
  // Fetch posts from API
  // ------------------------------------------------------
  const getPostsData = async () => {
    try {
      const res = await getPosts();
      setPosts(res.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getPostsData();
  }, []);

  // ------------------------------------------------------
  // Delete post
  // ------------------------------------------------------
  const handleDelete = async (id) => {
    try {
      const res = await deletePosts(id);

      if (res.status === 200) {
        setPosts((prev) => prev.filter((post) => post.id !== id));
        toast.success("Successfully Deleted");
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // ------------------------------------------------------
  // Enable edit mode
  // ------------------------------------------------------
  const handleEdit = (post) => {
    setUpdateData(post);
  };

  return (
    <>
      {/* Form Section */}
      <section className="section-form">
        <Form
          setPosts={setPosts}
          updateData={updateData}
          setUpdateData={setUpdateData}
        />
      </section>

      {/* Posts List */}
      <section className="section-posts">
        <ol>
          {posts.map((post) => {
            const { id, title, body } = post;

            return (
              <li key={id}>
                <p>Title: {title}</p>
                <p>Body: {body}</p>

                {/* Action Buttons */}
                <div>
                  <button
                    onClick={() => handleEdit(post)}
                    disabled={isEditing}
                  >
                    Edit
                  </button>

                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(id)}
                    disabled={isEditing}
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