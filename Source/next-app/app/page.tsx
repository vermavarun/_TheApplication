"use client";
import styles from "./page.module.css";
import { use, useEffect, useState } from "react";
import TopNav from "./components/topnav";

export default function Home() {
  const [userType, setUserType] = useState('');
  const [user, setUser] = useState({});

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
        setUser(data);
      });
    }

  }, []);
  function LoginWithGitHub() {
    window.location.href = "https://github.com/login/oauth/authorize?client_id=Ov23liY25mp04UVg8UCL&redirect_uri=http://localhost:3000/github";
  }

  return (
    <main className={styles.main}>
      <TopNav /> <img src={user.avatar_url} alt="avatar" />
      <h1>Home</h1>

      <button onClick={LoginWithGitHub}>Login with GitHub</button>

    </main>
  );
}
