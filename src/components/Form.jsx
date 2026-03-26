// ------------------------------------------------------
// Form Component
// Handles:
// 1. Adding new posts
// 2. Editing existing posts
// 3. Form validation
// 4. Smooth scroll during edit
// ------------------------------------------------------

import React, { useEffect, useRef, useState } from "react";
import { postData, updatePosts } from "../api/server";
import { toast } from "react-toastify";

const Form = ({ setPosts, updateData, setUpdateData }) => {
  // Reference for scrolling to form
  const formRef = useRef(null);

  // Form state
  const [addData, setAddData] = useState({
    title: "",
    body: "",
  });

  // Check if editing or adding
  const isEmpty = Object.keys(updateData).length === 0;

  // ------------------------------------------------------
  // Populate form when editing & scroll into view
  // ------------------------------------------------------
  useEffect(() => {
    if (updateData && Object.keys(updateData).length !== 0) {
      setAddData({
        title: updateData.title || "",
        body: updateData.body || "",
      });

      // Smooth scroll to form
      const yOffset = -90;
      const y =
        formRef.current?.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  }, [updateData]);

  // ------------------------------------------------------
  // Handle input change
  // ------------------------------------------------------
  const handleInput = (e) => {
    const { name, value } = e.target;

    setAddData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ------------------------------------------------------
  // Add new post
  // ------------------------------------------------------
  const postNewData = async () => {
    try {
      const res = await postData(addData);

      if (res.status === 201) {
        setPosts((prev) => [...prev, res.data]);
        setAddData({ title: "", body: "" });

        toast.success("Data Added Successfully");
      } else {
        toast.error("Failed to add data");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ------------------------------------------------------
  // Update existing post
  // ------------------------------------------------------
  const updatePostsData = async () => {
    try {
      const res = await updatePosts(updateData.id, addData);

      if (res.status === 200) {
        setPosts((prev) =>
          prev.map((item) =>
            item.id === res.data.id ? res.data : item
          )
        );

        toast.success("Post Updated Successfully");
      } else {
        toast.error("Failed to update post");
      }

      // Reset form & exit edit mode
      setAddData({ title: "", body: "" });
      setUpdateData({});
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ------------------------------------------------------
  // Handle form submit
  // ------------------------------------------------------
  const handleForm = (e) => {
    e.preventDefault();

    // Validation
    if (!addData.title.trim() || !addData.body.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    if (isEmpty) {
      postNewData();
    } else {
      updatePostsData();
    }
  };

  return (
    <form onSubmit={handleForm} ref={formRef}>
      {/* Title Input */}
      <div>
        <input
          type="text"
          name="title"
          placeholder="Add Title"
          value={addData.title}
          onChange={handleInput}
          autoComplete="off"
        />
      </div>

      {/* Body Input */}
      <div>
        <input
          type="text"
          name="body"
          placeholder="Add Body Content"
          value={addData.body}
          onChange={handleInput}
          autoComplete="off"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!addData.title.trim() || !addData.body.trim()}
      >
        {isEmpty ? "Add" : "Edit"}
      </button>
    </form>
  );
};

export default Form;