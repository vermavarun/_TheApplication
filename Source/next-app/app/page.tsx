"use client";
import styles from "./page.module.css";
import { use, useEffect, useState } from "react";
import TopNav from "./components/topnav";

export default function Home() {

  return (
    <main >
      <TopNav />
      <h1>Home</h1>
    </main>
  );
}
