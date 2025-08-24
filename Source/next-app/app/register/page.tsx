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
    const loadingToast = toast.loading("Creating your account...");

    try {
      const response = await fetch("/api/create", {
        cache: "no-store",
        method: "POST",
        body: JSON.stringify(jsonObject),
      });

      const data = await response.json();

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (data.status === 200) {
        setStatusMessage("Registration Successfully");
        toast.success("Registration successful! You can now login.");
      } else {
        setStatusMessage("Registration Not Successfully");
        toast.error(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      setStatusMessage("Registration Not Successfully with some errors");
      toast.error("Registration failed with network error. Please try again.");
    }
  }

  return (
    <main>
      <TopNav />
      <Toaster position="top-right" />
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
          <div>{statusMessage}</div>
        </form>

      </div>
    </main>
  );
}
