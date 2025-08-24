"use client";
import TopNav from "../components/topnav";
import "./page.css";
import { FormEvent, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [statusMessage, setStatusMessage] = useState<string>("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // Convert FormData to JSON object
    const jsonObject: Record<string, any> = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });

    // Show loading toast
    const loadingToast = toast.loading("Signing you in...");

    try {
      const response = await fetch("/api/login", {
        cache: "no-store",
        method: "POST",
        body: JSON.stringify(jsonObject),
      });

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (data.status === 200) {
        setStatusMessage("Login successful");
        window.localStorage.setItem("accessToken", data.details.accessToken);
        window.localStorage.setItem("loggedIn", "true");
        toast.success("Login successful! Welcome back.");
      } else {
        setStatusMessage("Login failed");
        toast.error(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      setStatusMessage("Login failed with some errors");
      toast.error("Login failed with network error. Please try again.");
    }
  }

  function LoginWithGoogle() {
    toast.loading("Redirecting to Google...");
    // the client id from GCP
    const google_client_id =
      "470832023584-s99974jriculdjrsbkfj5sn63lvhrd0k.apps.googleusercontent.com";
    const google_callback = `${window.location.origin}/callback?thirdParty=google`;
    const response_type = "code";
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];
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
    toast.loading("Redirecting to GitHub...");
    const github_client_id = "Ov23liY25mp04UVg8UCL";
    const github_callback = "http://localhost:3000/callback?thirdParty=github";

    // redirect the user to GitHub
    const link = `https://github.com/login/oauth/authorize?client_id=${github_client_id}&redirect_uri=${github_callback}`;
    window.location.assign(link);
  }

  return (
    <main>
      <TopNav />
      <Toaster position="top-right" />
      <div className="main-content">
        <form onSubmit={onSubmit} className="login-form">
          <h1>Login</h1>
          <div className="login-email">
            <div className="lbl">Email:</div>
            <div className="txtBoxlbl">
              <input type="text" name="email" />
            </div>
          </div>

          <div className="login-password">
            <div className="lbl">Password:</div>
            <div className="txtBoxlbl">
              <input type="password" name="password" />
            </div>
          </div>
          <div>
            <button type="submit" className="login-submit">
              Login
            </button>
          </div>

          <div className="login-msg">{statusMessage}</div>
        </form>
        <div>
          <button
            onClick={LoginWithGoogle}
            className="thirdPatySignLogin"
          ></button>
        </div>
        <div>
          <button
            onClick={LoginWithGitHub}
            className="thirdPatySignLogin githubbtn"
          ></button>
        </div>
      </div>
    </main>
  );
}
