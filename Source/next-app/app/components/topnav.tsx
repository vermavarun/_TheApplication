"use client";

import "../components/components.css";
import { useState, useEffect } from "react";

function TopNav() {
  const [loggedIn, setLogin] = useState(false);

  function logout() {
    localStorage.setItem("loggedIn", "false");
    localStorage.removeItem("userType");
    localStorage.removeItem("github_token");
    localStorage.removeItem("google_token");
    localStorage.removeItem("accessToken");
    setLogin(false);
    window.location.href = "/";
  }
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    const userType = localStorage.getItem("userType");

    if (userType) {
      setLogin(true);
    }
  }, []);
  return (
    <div className="topnav">
      <a href="/">Home</a>
      {loggedIn}
      {loggedIn && (
        <>
          <a href="/admin">Admin</a>

          <a style={{cursor:"pointer"}} onClick={logout}>Logout</a>
        </>
      )}
      {!loggedIn && (
        <>
          <a href="/register">Register</a>
          <a href="/login">Login</a>
        </>
      )}
    </div>
  );
}
export default TopNav;
