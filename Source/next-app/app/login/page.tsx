"use client";
import TopNav from "../components/topnav";
import styles from "./page.module.css";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [loggedIn, setLogin] = useState({});
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
          setLogin("Login Successfully + " + JSON.stringify(data.details.accessToken));
          window.localStorage.setItem("accessToken", data.details.accessToken);
          window.localStorage.setItem("loggedIn", "true");
        }
        else {
          setLogin("Error: " + data.message + " " + JSON.stringify(data.details));
        }
    } catch (error) {
      setLogin("Error: " + error);
    }
  }


  return (
    <main >
      <TopNav />
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <div>Email</div>
        <input type="text" name="email" />
        <div>Password</div>
        <input type="password" name="password" /> <br />
        <button type="submit">Login</button>
      </form>
      <div>{JSON.stringify(loggedIn)}</div>
    </main>
  );
}
