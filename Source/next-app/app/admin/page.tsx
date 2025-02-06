"use client";
import React from "react";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  interface User {
    name: string;
    email: string;
  }

  const [users, setUsers] = useState<Record<string, User>>({});
  useEffect(() => {

    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setUsers(data);
      })
      .catch((error) => console.log("Error:", error));
  }, []);

  return (
    <main className={styles.main}>
      <a href="/">Home Page</a>
      This is admin Page
      <h2>Users</h2>
      <ul>
        {Object.keys(users).map((key) => (
          <li key={key}>
            {users[key].name} - {users[key].email}
          </li>
        ))}
      </ul>
    </main>
  );
}
