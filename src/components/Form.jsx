// Component responsible for adding and editing posts

import React, { useEffect, useRef, useState } from "react";
import { postData, updatePosts } from "../api/server";
import { toast } from "react-toastify";

const Form = ({ setPosts, updateData, setUpdateData }) => {

   const formRef = useRef(null); // Ref for the form container

  // State for form inputs (title & body)
  const [addData, setAddData] = useState({
    title: "",
    body: "",
  });

  // Check if form is in Add mode (true) or Edit mode (false)
  const isEmpty = Object.keys(updateData).length === 0;

  // Populate form fields when updateData changes (Edit mode)
  useEffect(() => {
    if (updateData) {
      setAddData({
        title: updateData.title || "",
        body: updateData.body || "",
      });
    }

      // Scroll form into view smoothly
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
       window.scrollTo({
      top: top - 90, //  adjust gap here (80px = space from top)
      behavior: "smooth",
    });
  }, [updateData]);

  // Handle input changes dynamically for both title and body
  const handleInput = (e) => {
    const { name, value } = e.target;
    setAddData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new post to the server
  const postNewData = async () => {
    try {
      const res = await postData(addData);

      if (res.status === 201) {
        // Update local state to include the new post
        setPosts((prev) => [...prev, res.data]);

        // Reset form fields
        setAddData({ title: "", body: "" });

        // Show success message
        toast.success("Data Added Successfully");
      } else {
        toast.error("Failed to add data");
      }
    } catch (error) {
      // Handle network or server errors
      toast.error(error.message);
    }
  };

  // Update existing post on the server
  const updatePostsData = async () => {
    try {
      const res = await updatePosts(updateData.id, addData);

      if (res.status === 200) {
        // Update local posts state to reflect edited post
        setPosts((prev) =>
          prev.map((curElm) => (curElm.id === res.data.id ? res.data : curElm))
        );

        toast.success("Post Updated Successfully");
      } else {
        toast.error("Failed to update post");
      }

      // Reset form fields and clear updateData (back to Add mode)
      setAddData({ title: "", body: "" });
      setUpdateData({});
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle form submission (Add or Edit based on mode)
 const handleForm = (e) => {
  e.preventDefault();

  // ✅ Validation
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
      {/* Title input */}
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

      {/* Body input */}
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

      {/* Submit button dynamically shows Add or Edit */}
      <button type="submit">
        {isEmpty ? "Add" : "Edit"}
      </button>
    </form>
  );
};

export default Form;