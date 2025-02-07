"use client";

import "../components/components.css";
import { useState, useEffect } from "react";

function TopNav() {
  const [loggedIn, setLogin] = useState(false);

  function logout() {
    localStorage.setItem("loggedIn", "false");
    setLogin(false);
  }
  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
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

          <a onClick={logout}>Logout</a>
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
