"use client";
import TopNav from "../components/topnav";
import { use, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./page.css";
import { User } from "../models/user";

function Upload() {
  const [profile, setProfile] = useState(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const fileInputResume = useRef<HTMLInputElement>(null);
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

  async function getProfileDetails() {
    setIsLoading(true);
    try {
      const response = await fetch(
        "api/profile?id=" + selectedUserId
      );
      const data = await response.json();
      console.log(data);
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

  return (
    <main>
      <TopNav />
      <div className="main-content">
        <div className="users-list">
          <h1>Users</h1>
          <select onChange={(e) => setSelectedUserId(e.target.value)}>
          <option value="">Choose here</option>
            {Object.values(users).map((user: User) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
          ))}
          </select>

        </div>
        <div className="edit-user-details">
          <h1>Edit User Details</h1>

          <div className="form-group">
            <div className="lbl">Address</div>
            <div className="inpt" ><input type="text" onChange={(e)=>{setAddress(e.target.value)}} placeholder="Address" />
            </div>
          </div>

          <div className="form-group">
            <div className="lbl">City</div>
            <div className="inpt"><input type="text" placeholder="City" onChange={(e)=>{setCity(e.target.value)}} />
            </div>
          </div>

          <div className="form-group">
            <div className="lbl">State</div>
            <div className="inpt"><input type="text" placeholder="State" onChange={(e)=>{setState(e.target.value)}} />
            </div>
          </div>

          <div className="form-group">
            <div className="lbl">Country</div>
            <div className="inpt"><input type="text" placeholder="Country" onChange={(e)=>{setCountry(e.target.value)}} />
            </div>
          </div>

          <div>
            <div className="fileUpload-wrapper">
              <div className="fileUploadInput">
              <label>✨ Upload Picture</label>
              <input ref={fileInput} type="file" />
              <button>+</button>
              </div>
            </div>

            <div className="fileUpload-wrapper">
              <div className="fileUploadInput">
              <label>✨ Upload Resume</label>
              <input ref={fileInputResume} type="file" />
              <button>+</button>
              </div>
            </div>
          </div>

          <button className="app-button" onClick={handleUpload}>Save</button>

        </div>

        <hr/>

        <button className="app-button" onClick={getProfileDetails}>
          Get Profile Details
        </button>

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
            <div>Resume: </div>
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
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </main>
  );
}

export default Upload;
