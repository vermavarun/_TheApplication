"use client";
import { useAppSelector } from "@/store/store";
import TopNav from "../components/topnav";
import { User } from "../models/user";
import { use, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";



function Upload() {
  const currentUser: User = useAppSelector((state) => state.user);
  const [profile, setProfile] = useState(null);
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleUpload() {
    if (!fileInput.current || !fileInput.current.files || fileInput.current.files.length === 0) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("Id", "2141103f-b316-4f61-b3f8-5df4522681c3");
    formData.append("Address", "123 Street");
    formData.append("City", "New York");
    formData.append("State", "NY");
    formData.append("Country", "USA");
    formData.append("ProfilePicture", fileInput.current.files[0]);

    try {
      const response = await fetch("api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      toast.success("Upload successful");
    } catch (error) {
      console.error("Upload error:", error);

      toast.error("Upload failed");
    }
  }

  async function getProfileDetails() {
    try {
      const response = await fetch("api/profile?id=2141103f-b316-4f61-b3f8-5df4522681c3");
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Profile error:", error);
    }
  }

  return (
    <main>
      <TopNav />
      <div className="main-content">
        <br /><br /><br /><br />
        Upload
        <br />
        User: {currentUser?.name}
        <br />
        ID: {currentUser?.id}
        <br /><br /><br /><br />
        <input type="file" ref={fileInput} />
        <br /><br />
        <button onClick={handleUpload}>Upload</button>

        <button onClick={getProfileDetails}>Get Profile Details</button>

      <br/>
      <br/>
      <br/>

        <div>
        <h1>Profile Details</h1>
        <div>
          <div>ID: {profile?.id}</div>
          <div>Address: {profile?.address}</div>
          <div>City: {profile?.city}</div>
          <div>State: {profile?.state}</div>
          <div>Country: {profile?.country}</div>
          <div>Profile Picture: </div>
          <div>
            {profile?.profilePicture && (
            <img src={`data:image/jpeg;base64,${profile?.profilePicture}`} alt="Profile Picture" />
            )}
          </div>
        </div>
      </div>

      </div>


    </main>
  );
}

export default Upload;
