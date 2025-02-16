"use client";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { User } from "../interfaces/user";
import TopNav from "../components/topnav";
import "./page.css";
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [usersInitial, setUsersInitial] = useState<Record<string, User>>({});
  const [users, setUsers] = useState<Record<string, User>>({});
  const [editingId, setId] = useState('');
  const [updatedFirstNameValue, setUpdatedFirstNameValue] = useState('');
  const [updatedLastNameValue, setUpdatedLastNameValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  function updateUser(id: string, firstName: string,lastName:string) : boolean {
    try {
      fetch(`/api/users/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName: firstName, id: id, lastName: lastName }),
      }).then((response) => {
        if (response.status === 200) {
          toast.success('User updated');
          console.log(response);
          return true;
        }
        else {
          toast.error('Error updating user');
          return false;
        }
      }).catch((e) => {
          toast.error('Error updating user');
          return false;
      });
          return true;
    } catch (e) {
        toast.error('Error updating user');
        console.log(e);
        return false;
    }
  }

  function deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        fetch(`/api/users/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        }).then((response) => {
          toast.success('User deleted');
          console.log(response);
          getAllUsers();
        }).catch((e) => {
          toast.error('Error deleting user');
          console.log(e);
        });
      } catch (e) {
        toast.error('Error deleting user');
        console.log(e);
      }
    }
  }

  function filterResults(searchValue: string) {
    setSearchValue(searchValue);
    const usersArray = Object.values(usersInitial); // Convert users object to an array
    const filteredUsers = usersArray.filter((user) => {
      return (
              user.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
              user.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
              user.email.toLowerCase().includes(searchValue.toLowerCase())
            );
    });

    // Convert the filtered array back to an object
    const filteredUsersObject = filteredUsers.reduce((acc, user) => {
      acc[user.id] = user; // Assuming each user has a unique 'id' property
      return acc;
    }, {} as Record<string, User>);

    setUsers(filteredUsersObject);
  }

  const handleSave = (id:string,firstName:string,lastName:string) => {
    setId('');
    const result = updateUser(id,firstName,lastName);
    if(result) {
      let usersCopy = users;
      Object.values(usersCopy).map((user) => {
      if(user.id === id) {
        user.firstName = firstName;
        user.lastName = lastName;
      }
      });
      setUsers(usersCopy);
    }
  }

  function getAllUsers() {
    try {
      fetch("/api/users")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setUsers(data);
          setUsersInitial(data);
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

          <div key="headers" className="header first-header">
            <div className="column-header">🌟 ID</div>
            <div className="column-header">🌐 Email</div>
            <div className="column-header">First Name</div>
            <div className="column-header">Last Name</div>
            <div className="column-header">Search <input type="search" spellCheck="false" className="search-txt" onChange={(e)=>{filterResults(e.target.value)}}  placeholder="Search.." /></div>
          </div>


          {Object.keys(users).map((key) => (
            <div key={key}>
              <div className={`header user ${users[key].id == editingId ? 'hidden': ''}`} row-id={users[key].id}>
                <div className="column-header">🌟 {users[key].id}</div>
                <div className="column-header">🌐 {users[key].email}</div>
                <div className="column-header">{users[key].firstName}</div>
                <div className="column-header">{users[key].lastName}</div>
                <div className="display-btn edit-btn" onClick={()=>setId(users[key].id)}>✏️ </div>
                <div className="display-btn delete-btn" onClick={()=>deleteUser(users[key].id)}>🗑️ </div>
              </div>
            {
              editingId === users[key].id &&
              <div className="header user" row-id={users[key].id + "-edit"}>
                <div className="column-header">🌟 {users[key].id}</div>
                <div className="column-header">🌐 {users[key].email}</div>
                <div className="column-header"><input type="text" className="editable-firstName editable-txtbox" defaultValue={users[key].firstName} onChange={(e)=>{setUpdatedFirstNameValue(e.target.value)}}/></div>
                <div className="column-header"><input type="text" className="editable-lastName editable-txtbox" defaultValue={users[key].lastName} onChange={(e)=>{setUpdatedLastNameValue(e.target.value)}}/></div>
                <div className="inedit-btn save-btn" onClick={()=>handleSave(users[key].id,updatedFirstNameValue,updatedLastNameValue)}>💾 </div>
                <div className="inedit-btn cancel-btn" onClick={()=>setId('')}>❌ </div>
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
