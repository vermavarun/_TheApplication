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
    else if (loggedIn === "true") {
      setLogin(true);
    }
  }, []);

  const [userType, setUserType] = useState('');
  interface User {
    login?: string;
    avatar_url?: string;
    name?: string;
    picture?: string;
  }

  const [user, setUser] = useState<User>({});

  useEffect(() => {
    const userTypeLocal = localStorage.getItem("userType");
    setUserType(userTypeLocal ?? '');
    if (userTypeLocal === "github") {
      const github_token = localStorage.getItem("github_token");
      fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${github_token}`
        }
      }).then((res) => res.json()).then((data) => {
        console.log(data);
        setUser(data);
      });
    }
    else if (userTypeLocal === "google") {
      const google_token = localStorage.getItem("google_token");
      fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
        headers: {
          Authorization: `Bearer ${google_token}`
        }
      }).then((res) => res.json()).then((data) => {
        console.log(data);
        setUser(data);
      });
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
      {userType === 'github' && <><span>Welcome {user.login}</span> <img  src={user.avatar_url} alt="avatar" referrerPolicy="no-referrer" /></>}
      {userType === 'google' && <><span>Welcome {user.name}</span> <img  src={user.picture} alt="avatar" referrerPolicy="no-referrer" /></>}
    </div>
  );
}
export default TopNav;
