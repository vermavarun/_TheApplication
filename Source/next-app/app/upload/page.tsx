"use client";
import TopNav from "../components/topnav";
import { use, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./page.css";

function Upload() {
  const [profile, setProfile] = useState(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [IsLoading, setIsLoading] = useState(false);

  async function handleUpload() {
    if (
      !fileInput.current ||
      !fileInput.current.files ||
      fileInput.current.files.length === 0
    ) {
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
      setIsLoading(true);
      const response = await fetch("api/upload", {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      toast.success("Upload successful");
      setIsLoading(false);
    } catch (error) {
      console.error("Upload error:", error);

      toast.error("Upload failed");
      setIsLoading(false);
    }
  }

  async function getProfileDetails() {
    setIsLoading(true);
    try {
      const response = await fetch(
        "api/profile?id=2141103f-b316-4f61-b3f8-5df4522681c3"
      );
      const data = await response.json();
      setIsLoading(false);
      setProfile(data);
    } catch (error) {
      console.error("Profile error:", error);
      setIsLoading(false);
    }
  }

  return (
    <main>
      <TopNav />
      <div className="main-content">
        <br />
        <br />
        <br />
        <br />

        <br />
        <br />
        <br />
        <br />
        {/* <label htmlFor="profile-picture">

          <button className="app-button">Click to Upload Profile Picture</button>

        </label>
         */}

    <div className="fileUpload-wrapper">
      <div className="fileUploadInput">
      <label>✨ Upload File</label>
      <input ref={fileInput} type="file" />
      <button>+</button>
      </div>
    </div>

        {/* <input id="profile-picture"  className="app-button" type="file" ref={fileInput} /> */}
        <br />
        <br />
        <button className="app-button" onClick={handleUpload}>
          Upload
        </button>
        <br />
        <br />
        <button className="app-button" onClick={getProfileDetails}>
          Get Profile Details
        </button>

        <br />
        <br />
        <br />

        <div>
          {IsLoading && (
            <div>
              <img src="/static/images/loading.gif" />
            </div>
          )}
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
                <img
                  src={`data:image/jpeg;base64,${profile?.profilePicture}`}
                  alt="Profile Picture"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </main>
  );
}

export default Upload;
