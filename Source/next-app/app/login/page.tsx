"use client";
import TopNav from "../components/topnav";
import styles from "./page.module.css";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [login, setLogin] = useState<any>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLogin({});
    const formData = new FormData(event.currentTarget);
    // Convert FormData to JSON object
    const jsonObject: Record<string, any> = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });
    const response = await fetch("/api/login", {
      cache: "no-store",
      method: "POST",
      body: JSON.stringify(jsonObject),
    });
    try {
      const data = await response.json();
      if (data.status === 200) {
        setLogin(
          "Login Successfully + " + JSON.stringify(data.details.accessToken)
        );
        window.localStorage.setItem("accessToken", data.details.accessToken);
        window.localStorage.setItem("loggedIn", "true");
      } else {
        setLogin("Error: " + data.message + " " + JSON.stringify(data.details));
      }
    } catch (error) {
      setLogin("Error: " + error);
    }
  }

  function LoginWithGoogle() {
    // the client id from GCP
    const google_client_id = "470832023584-s99974jriculdjrsbkfj5sn63lvhrd0k.apps.googleusercontent.com";
    const google_callback = `${window.location.origin}/callback?thirdParty=google`;
    const response_type = "code";
    const scopes =["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"];
    const scope_expanded = encodeURIComponent(scopes.join(" "));

    // create a CSRF token and store it locally
    const state = Array.from(
      crypto.getRandomValues(new Uint8Array(16)),
      (byte) => byte.toString(16).padStart(2, "0")
    ).join("");
    localStorage.setItem("latestCSRFToken", state);

    // redirect the user to Google
    const link = `https://accounts.google.com/o/oauth2/auth?scope=${scope_expanded}&response_type=${response_type}&state=${state}&redirect_uri=${google_callback}&client_id=${google_client_id}`;
    window.location.assign(link);
  }

  function LoginWithGitHub() {
    const github_client_id = "Ov23liY25mp04UVg8UCL";
    const github_callback = "http://localhost:3000/callback?thirdParty=github";

    // redirect the user to GitHub
    const link = `https://github.com/login/oauth/authorize?client_id=${github_client_id}&redirect_uri=${github_callback}`;
    window.location.assign(link);
  }

  return (
    <main>
      <TopNav />
      <div className="main-content">
        <h1>Login</h1>
        <form onSubmit={onSubmit}>
          <div>Email</div>
          <input type="text" name="email" />
          <div>Password</div>
          <input type="password" name="password" /> <br />
          <br />
          <button type="submit">Login</button>
          <br />
          <br />
        </form>
        <button onClick={LoginWithGoogle}>Login with Google</button> <br />
        <br />
        <button onClick={LoginWithGitHub}>Login with GitHub</button>
      </div>
    </main>
  );
}
