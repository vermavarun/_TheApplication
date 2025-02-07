"use client";
import styles from "./page.module.css";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [registered, setRegistered] = useState({});
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRegistered({});
    const formData = new FormData(event.currentTarget);
    // Convert FormData to JSON object
    const jsonObject: Record<string, any> = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });
    const response = await fetch("/api/create", {
      cache: "no-store",
      method: "POST",
      body: JSON.stringify(jsonObject),
    });
    try {
        const data = await response.json();
        if (data.status === 200) {
          setRegistered("Registered Successfully");
        }
        else {
          setRegistered("Error: " + data.message + " " + JSON.stringify(data.details));
        }
    } catch (error) {
      setRegistered("Error: " + error);
    }
  }
  // function register() {
  //   console.log("Registering");
  //   fetch("/api/create", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       email: "varun@varun.com",
  //       password: "Pass@123",
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setRegistered(data);
  //     })
  //     .catch((error) => console.log("Error:", error));
  // }

  return (
    <main className={styles.main}>
      <a href="/">Home Page</a>
      <form onSubmit={onSubmit}>
        <div>Email</div>
        <input type="text" name="email" />
        <div>Password</div>
        <input type="password" name="password" /> <br />
        <button type="submit">Register</button>
      </form>
      <div>{JSON.stringify(registered)}</div>
    </main>
  );
}
