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
  function LoginWithGitHub() {
    window.location.href = "https://github.com/login/oauth/authorize?client_id=Ov23liY25mp04UVg8UCL&redirect_uri=http://localhost:3000/github";
  }

  return (
    <main >
      <TopNav />
      <h1>Home</h1>

      {userType === 'github' && <><h2>Welcome {user.login}</h2> <img src={user.avatar_url} alt="avatar" /></>}
      {userType === 'google' && <><h2>Welcome {user.name}</h2> <img src={user.picture} alt="avatar" /></>}
      {userType === '' && <h2>Not logged in</h2> && <button onClick={LoginWithGitHub}>Login with GitHub</button>}

    </main>
  );
}
