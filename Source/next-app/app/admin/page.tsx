"use client";
import React from "react";
import { useEffect, useState } from "react";
import { User } from "../interfaces/user";
import TopNav from "../components/topnav";
import "./page.css";

export default function Home() {
  const [users, setUsers] = useState<Record<string, User>>({});
  const [editingId, setId] = useState('');

  const handleEdit = (id:string) => {
    setId(id);
  }

  function updateUser(id: string, firstName: string) {
    try {
      fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName }),
      }).then((response) => {
        console.log(response);
      }
      );
    }
    catch (e) {
      console.log(e);
  }
}

  const handleSave = (id:string,firstName:string) => {
    setId('');
    updateUser(id,firstName);
    let usersCopy = users;
    Object.values(usersCopy).map((user) => {
      if(user.id === id) {
        user.firstName = firstName;
      }
    }
    );

    setUsers(usersCopy);
  }

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
        <div key="users" className="users">
          <div className="header first-header"><div className="column-header">🌟 ID</div><div className="column-header">🌐 Email</div><div className="column-header">First Name</div></div>

          {Object.keys(users).map((key) => (
            <>
            <div key={key} className={`header user ${users[key].id == editingId ? 'hidden': ''}`} row-id={users[key].id}>
              <div className="column-header">🌟 {users[key].id}</div>
              <div className="column-header">🌐 {users[key].email}</div>
              <div className="column-header">{users[key].firstName}</div>
              <div className="column-header edit-btn" onClick={()=>handleEdit(users[key].id)}>✏️ </div>
            </div>

            {
              editingId === users[key].id &&
              <div key={key +'edit'} className="header user" row-id={users[key].id + "edit"}>
                <div className="column-header">🌟 {users[key].id}</div>
                <div className="column-header">🌐 {users[key].email}</div>
                <div className="column-header"><input type="text" className=""  /></div>
                <div className="column-header save-btn" onClick={()=>handleSave(users[key].id,"updated")}>💾 </div>
              </div>
            }
          </>

          ))}

        </div>

      </div>
    </main>
  );
}
