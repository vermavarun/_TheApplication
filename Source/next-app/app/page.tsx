"use client";
import styles from "./page.module.css";
import { use, useEffect, useState } from "react";
import TopNav from "./components/topnav";
import Producer from "./components/producer";
import Consumer from "./components/consumer";

export default function Home() {

  return (
    <main >
      <TopNav />

      <div className="main-content">
      <h1>Home</h1>
      <Producer />
      <hr/>
      <Consumer  />
      </div>
    </main>
  );
}
