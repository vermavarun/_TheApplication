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
          console.log(data);
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
          <div className="header"><div className="column-header">🌟 ID</div><div className="column-header">🌐 Email</div><div className="column-header">First Name</div></div>

          {Object.keys(users).map((key) => (
            <div key={key} className="header user">
              <div className="column-header">🌟 {users[key].id}</div>
              <div className="column-header">🌐 {users[key].email}</div>
              <div className="column-header">{users[key].firstName}</div>
            </div>
          ))}

        </div>

      </div>
    </main>
  );
}
