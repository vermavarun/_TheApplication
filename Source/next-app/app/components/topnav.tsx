"use client";

import "../components/components.css";
import { useState, useEffect } from "react";

function TopNav() {
  function logout() {
    localStorage.setItem("loggedIn", "false");
  }
  let loggedIn = "false";
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    console.log("loggedIn", loggedIn);
    console.log(loggedIn == "true");
  }, []);
  return (
    <div className="topnav">
      <a href="/">Home</a>
      <a href="/admin">Admin</a>
      {loggedIn === "true" && (
        <>
          <a hidden={loggedIn === "true"} href="/register">
            Register
          </a>

          <a href="/login">Login</a>
        </>
      )}
      {loggedIn !== "true" && (
        <a onClick={logout}>
          Logout
        </a>
      )}
    </div>
  );
}
export default TopNav;
