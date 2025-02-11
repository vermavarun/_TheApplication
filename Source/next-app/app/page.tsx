"use client";
import styles from "./page.module.css";
import { use, useEffect, useState } from "react";
import TopNav from "./components/topnav";

export default function Home() {

  return (
    <main >
      <TopNav />
      <div className="main-content">
      <h1>Home</h1>
      </div>
    </main>
  );
}
