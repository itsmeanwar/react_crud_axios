// App.jsx

import React from "react";
import Posts from "./components/Posts";
import "./App.css";

const App = () => {
  return (
    <section className="main-section">
      {/* Posts Component (CRUD operations) */}
      <Posts />
    </section>
  );
};

export default App;
