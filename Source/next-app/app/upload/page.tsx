"use client";
import TopNav from "../components/topnav";
import { use, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./design.css";
import { User } from "../models/user";

function Upload() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState<unknown>();
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
    // if (
    //   !pictureFileInput.current ||
    //   !pictureFileInput.current.files ||
    //   pictureFileInput.current.files.length === 0
    // ) {
    //   alert("Please select a file before uploading.");
    //   return;
    // }

    // if (
    //   !resumeFileInput.current ||
    //   !resumeFileInput.current.files ||
    //   resumeFileInput.current.files.length === 0
    // ) {
    //   alert("Please select a file before uploading.");
    //   return;
    // }

    const formData = new FormData();
    formData.append("Id", selectedUserId);
    formData.append("Address", address);
    formData.append("City", city);
    formData.append("State", state);
    formData.append("Country", country);
    if (pictureFileInput.current && pictureFileInput.current.files && pictureFileInput.current.files.length > 0) {
      formData.append("ProfilePicture", pictureFileInput.current.files[0]);
    }
    if (resumeFileInput.current && resumeFileInput.current.files && resumeFileInput.current.files.length > 0) {
      formData.append("Resume", resumeFileInput.current.files[0]);
    }

    try {
      setIsLoading(true);
      const response = await fetch("api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMessage(data);
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
      setMessage(error);
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
    setProfile(null);
  }

  function clearForm() {
    setAddress('');
    setCity('');
    setState('');
    setCountry('');
  }


  async function getProfileDetails(id: string) {
    if (!id) {
      alert("Please select a user before fetching profile details.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        "api/profile?id=" + id
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
      setMessage(data);
    } catch (error) {
      console.error("Profile error:", error);
      setMessage(error);
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
    setSelectedUserId(preValue => value); // to wait for the value to be set
    getProfileDetails(value);

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

        <div className="user-details-form">
          <h1>User Details</h1>

          <div className="user-form-row">
            <div className="display-label">Address</div>
            <div className="app-input-text"><input defaultValue={profile?.address} spellCheck="false" type="text" onChange={(e)=>{setAddress(e.target.value)}} placeholder="Address" /></div>
          </div>

          <div className="user-form-row">
            <div className="display-label">City</div>
            <div className="app-input-text"><input defaultValue={profile?.city} spellCheck="false" type="text" onChange={(e)=>{setCity(e.target.value)}} placeholder="City" /></div>
          </div>

          <div className="user-form-row">
            <div className="display-label">State</div>
            <div className="app-input-text"><input defaultValue={profile?.state} spellCheck="false" type="text" onChange={(e)=>{setState(e.target.value)}} placeholder="State" /></div>
          </div>

          <div className="user-form-row">
            <div className="display-label">Country</div>
            <div className="app-input-text"><input defaultValue={profile?.country} spellCheck="false" type="text" onChange={(e)=>{setCountry(e.target.value)}} placeholder="Country" /></div>
          </div>

          <div className="user-form-row">
            <div className="display-label">Profile Picture</div>
            <div className="app-input-file">
              <input type="file" ref={pictureFileInput} />
              <button>+</button>
            </div>
          </div>

          <div className="user-form-row">
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
      <pre>{JSON.stringify(message, null, 2)}</pre>

      <Toaster position="top-right" reverseOrder={false} />
    </main>
  );
}

export default Upload;
