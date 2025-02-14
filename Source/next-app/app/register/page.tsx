"use client";
import TopNav from "../components/topnav";
import "./page.css";
import { FormEvent, useEffect, useState } from "react";

export default function Home() {
  const [registered, setRegistered] = useState('');
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
      } else {
        setRegistered(
          data.details.errors
        );
      }
    } catch (error) {
      setRegistered("Error in registering: " + error);
    }
  }

  return (
    <main>
      <TopNav />
      <div className="main-content">

        <form onSubmit={onSubmit} className="register-form">
        <h1>Register</h1>
          <div className="register-email">
            <div className="lbl">Email:</div>
            <div className="txtBoxlbl"><input type="text" name="email" /></div>
            </div>

          <div className="register-password">
            <div className="lbl">Password:</div>
            <div className="txtBoxlbl"><input type="password" name="password" /></div>
          </div>
          <button type="submit" className="register-submit">Register</button>
          <div>{registered && JSON.stringify(registered)}</div>
        </form>

      </div>
    </main>
  );
}
