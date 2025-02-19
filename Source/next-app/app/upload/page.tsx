"use client";
import TopNav from "../components/topnav";
import { use, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./design.css";
import { User } from "../models/user";

function Upload() {
  const [profile, setProfile] = useState(null);
  const pictureFileInput = useRef<HTMLInputElement>(null);
  const resumeFileInput = useRef<HTMLInputElement>(null);
  const [IsLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');


  async function handleUpload() {
    if (
      !fileInput.current ||
      !fileInput.current.files ||
      fileInput.current.files.length === 0
    ) {
      alert("Please select a file before uploading.");
      return;
    }

    if (
      !fileInputResume.current ||
      !fileInputResume.current.files ||
      fileInputResume.current.files.length === 0
    ) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("Id", selectedUserId);
    formData.append("Address", address);
    formData.append("City", city);
    formData.append("State", state);
    formData.append("Country", country);
    formData.append("ProfilePicture", fileInput.current.files[0]);
    formData.append("Resume", fileInputResume.current.files[0]);

    try {
      setIsLoading(true);
      const response = await fetch("api/upload", {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        toast.success("Upload successful");
      }
      else {
        toast.error("Upload failed");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
      setIsLoading(false);
    }
  }

  function handleCancel() {
    setSelectedUserId('');
    setAddress('');
    setCity('');
    setState('');
    setCountry('');
  }

  async function getProfileDetails() {
    if (!selectedUserId) {
      alert("Please select a user before fetching profile details.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        "api/profile?id=" + selectedUserId
      );
      const data = await response.json();
      console.log(data);
      if (response.status !== 200) {
        toast.error("Error fetching profile details");
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      setProfile(data);
      setAddress(data.address);
      setCity(data.city);
      setState(data.state);
      setCountry(data.country);

    } catch (error) {
      console.error("Profile error:", error);
      setIsLoading(false);
    }
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
          toast.error('Error fetching users');
          setUsers({});
        });
    } catch (e) {
      toast.error('Error fetching users');
      console.log(e);
    }
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  function handleUserChange(value: string): void {
    setSelectedUserId(value);
    getProfileDetails();
  }

  return (
    <main>
      <TopNav />
      <div className="main-content">

        {/* Loader */}
        <div className="loader">
          {IsLoading && (
            <div>
              <img src="/static/images/loading.gif" />
            </div>
          )}

        </div>

        {/* Users list Drop down */}
        <div className="users-list-dropdown">
          <h1>Users</h1>
          <select onChange={(e) => handleUserChange(e.target.value)}>
          <option value="">Choose here</option>
            {Object.values(users).map((user: User) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
          ))}
          </select>
        </div>

        <div className="user-details-form">
          <h1>User Details</h1>

          <div>
            <div className="display-label">Address</div>
            <div className="app-input-text"><input defaultValue={profile?.address} spellCheck="false" type="text" onChange={(e)=>{setAddress(e.target.value)}} placeholder="Address" /></div>
          </div>

          <div>
            <div className="display-label">City</div>
            <div className="app-input-text"><input defaultValue={profile?.city} spellCheck="false" type="text" onChange={(e)=>{setCity(e.target.value)}} placeholder="City" /></div>
          </div>

          <div>
            <div className="display-label">State</div>
            <div className="app-input-text"><input defaultValue={profile?.state} spellCheck="false" type="text" onChange={(e)=>{setState(e.target.value)}} placeholder="State" /></div>
          </div>

          <div>
            <div className="display-label">Country</div>
            <div className="app-input-text"><input defaultValue={profile?.country} spellCheck="false" type="text" onChange={(e)=>{setCountry(e.target.value)}} placeholder="Country" /></div>
          </div>

          <div>
            <div className="display-label">Profile Picture</div>
            <div className="app-input-file">
              <input type="file" ref={pictureFileInput} />
              <button>+</button>
            </div>
          </div>

          <div>
            <div className="display-label">Resume (pdf)</div>
            <div className="app-input-file">
              <input type="file" ref={resumeFileInput} />
              <button>+</button>
            </div>
          </div>

          <div>
            <button className="app-button" onClick={handleUpload}>Save</button>
            <button className="app-button" onClick={handleCancel}>Cancel</button>
          </div>

        </div>

        {/* Users Profile Picture */}
        <div className="user-profile-picture">
          <h1>Profile Picture</h1>
          <div>
                {profile?.profilePicture && (
                  <img
                    src={`data:image/jpeg;base64,${profile?.profilePicture}`}
                    alt="Profile Picture"
                  />
                )}
          </div>
        </div>

        {/* Users Resume */}
        <div className="user-resume">
          <h1>Resume</h1>
          <div>
            {profile?.resume && (
              <a href={`data:application/pdf;base64,${profile?.resume}`} download="resume.pdf">
                Download Resume
              </a>
            )}
          </div>
          <div className="embedResumePDF">
            {profile?.resume && (
              <embed src={`data:application/pdf;base64,${profile?.resume}`} width="100%" height="600px" />
            )}
          </div>
        </div>

      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </main>
  );
}

export default Upload;
