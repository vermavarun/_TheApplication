"use client";
import React from "react";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { User } from "../interfaces/user";
import TopNav from "../components/topnav";

export default function Home() {
  const [users, setUsers] = useState<Record<string, User>>({});
  useEffect(() => {
    try {
      fetch("/api/users")
        .then((response) => response.json())
        .then((data) => {
          setUsers(data);
        })
        .catch((error) => {
          console.error("Error:", error)
        });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <main>
      <TopNav />
      <div className="main-content">
        This is admin Page
        <h2>Users</h2>
        <ul>
          {Object.keys(users).map((key) => (
            <li key={key} style={{ listStyleType: "none" }}>
              <div
                style={{
                  display: "block",
                  border: "1px solid red",
                  padding: "10px",
                  margin: "10px",
                  width: "35em",
                }}
              >
                <div
                  style={{ display: "block", borderBottom: "1px dashed red" }}
                >
                  <span>ID:</span>
                  <span style={{ float: "right" }}>{users[key].id}</span>
                </div>

                <div style={{ display: "block" }}>
                  <span>Email:</span>
                  <span style={{ float: "right" }}>{users[key].email}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </main>
  );
}
