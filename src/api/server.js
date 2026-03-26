import axios from "axios";

// Create reusable axios instance with base URL
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

// Fetch all posts
export const getPosts = () => {
  return api.get("/posts");
};

// Delete post by ID
export const deletePosts = (id) => {
  return api.delete(`/posts/${id}`);
};

// Create new post
export const postData = (payload) => {
  return api.post("/posts", payload);
};

// Update existing post by ID
export const updatePosts = (id, post) => {
  return api.put(`/posts/${id}`, post);
};