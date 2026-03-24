// Component responsible for adding new posts

import React, { useState } from "react";
import { postData } from "../api/server";
import { toast } from "react-toastify";

const Form = ({ setPosts }) => {
  // State for form inputs
  const [addData, setAddData] = useState({
    title: "",
    body: "",
  });

  // Handle input change
  const handleInput = (e) => {
    const { name, value } = e.target;

    setAddData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add new post
  const postNewData = async () => {
    try {
      const res = await postData(addData);

      if (res.status === 201) {
        // Update UI with new post
        setPosts((prev) => [...prev, res.data]);

        // Reset form
        setAddData({ title: "", body: "" });

        // Success message
        toast.success("Data Added Successfully");
      } else {
        toast.error("Failed to add data");
      }
    } catch (error) {
      // Handle error
      toast.error(error.message);
    }
  };

  // Handle form submit
  const handleForm = (e) => {
    e.preventDefault();
    postNewData();
  };

  return (
    <form onSubmit={handleForm}>
      {/* Title input */}
      <div>
        <input
          type="text"
          name="title"
          placeholder="Add Title"
          value={addData.title}
          onChange={handleInput}
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
        />
      </div>

      {/* Submit button */}
      <button type="submit">Add</button>
    </form>
  );
};

export default Form;
