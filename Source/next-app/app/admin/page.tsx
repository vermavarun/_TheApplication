"use client";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { User } from "../interfaces/user";
import TopNav from "../components/topnav";
import "./page.css";
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [users, setUsers] = useState<Record<string, User>>({});
  const [editingId, setId] = useState('');
  const [updatedFirstNameValue, setUpdatedFirstNameValue] = useState('');

  const handleEdit = (id:string) => {
    setId(id);
  }

  function updateUser(id: string, firstName: string) {
    try {
      fetch(`/api/users/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName: firstName, id: id }),
      }).then((response) => {
        toast.success('User updated');
        console.log(response);
      }
      );
    }
    catch (e) {
      toast.error('Error updating user');
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
          <div key="headers" className="header first-header"><div className="column-header">🌟 ID</div><div className="column-header">🌐 Email</div><div className="column-header">First Name</div></div>

          {Object.keys(users).map((key) => (
            <div key={key}>
            <div className={`header user ${users[key].id == editingId ? 'hidden': ''}`} row-id={users[key].id}>
              <div className="column-header">🌟 {users[key].id}</div>
              <div className="column-header">🌐 {users[key].email}</div>
              <div className="column-header">{users[key].firstName}</div>
              <div className="column-header edit-btn" onClick={()=>handleEdit(users[key].id)}>✏️ </div>
            </div>

            {
              editingId === users[key].id &&
              <div className="header user" row-id={users[key].id + "-edit"}>
                <div className="column-header">🌟 {users[key].id}</div>
                <div className="column-header">🌐 {users[key].email}</div>
                <div className="column-header"><input type="text" className="" defaultValue={users[key].firstName} onChange={(e)=>{setUpdatedFirstNameValue(e.target.value)}}/></div>
                <div className="column-header save-btn" onClick={()=>handleSave(users[key].id,updatedFirstNameValue)}>💾 </div>
              </div>
            }
          </div>

          ))}

        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </main>

  );
}
