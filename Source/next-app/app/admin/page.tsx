"use client";
import React from "react";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  interface User {
    name: string;
    id: string;
    email: string;
  }

  const [users, setUsers] = useState<Record<string, User>>({});
  useEffect(() => {

    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
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
          <li key={key} style={{ listStyleType: "none" }}>
            <div style={{ display: "block", border: "1px solid red", padding: "10px", margin: "10px", width: "35em" }}>

            <div style={{ display: "block" , borderBottom: "1px dashed red"}}>
              <span>ID:</span>
              <span style={{float:"right"}}>{users[key].id}
              </span>
            </div>

            <div style={{ display: "block" }}>
              <span>Email:</span>
              <span style={{float:"right"}}>{users[key].email}
              </span>
            </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
