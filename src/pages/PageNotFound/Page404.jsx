import React from "react";
import "./Page404.css";
import { Link } from "react-router-dom";
export const Page404 = () => {
  return (
    <div class="section">
      <h1 class="error">404</h1>
      <div class="page">Ooops!!! The page you are looking for is not found</div>
      <Link to={"/"} class="back-home">
        Back to home
      </Link>
    </div>
  );
};
