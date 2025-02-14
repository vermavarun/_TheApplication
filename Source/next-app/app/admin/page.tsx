"use client";
import React from "react";
import { useEffect, useState } from "react";
import { User } from "../interfaces/user";
import TopNav from "../components/topnav";
import "./page.css";

export default function Home() {
  const [users, setUsers] = useState<Record<string, User>>({});

  function getAllUsers() {
    try {
      fetch("/api/users")
        .then((response) => response.json())
        .then((data) => {
          setUsers(data);
        })
        .catch((error) => {
          setUsers({});
        });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <main>
      <TopNav />
      <div className="main-content">
        This is admin Page
        <h1>Users</h1>
        <div className="users">
          {Object.keys(users).map((key) => (
            <div key={key} className="user">
              <div className="user-id">
                <span>🌟 ID: </span>
                <span>{users[key].id}</span>
              </div>
              <div className="user-email">
                <span>🌐 Email: </span>
                <span>{users[key].email}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
