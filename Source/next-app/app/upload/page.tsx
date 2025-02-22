"use client";
import TopNav from "../components/topnav";
import { use, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./design.css";
import { User } from "../models/user";

function Upload() {
  const [message, setMessage] = useState<unknown>();
  const pictureFileInput = useRef<HTMLInputElement>(null);
  const resumeFileInput = useRef<HTMLInputElement>(null);
  const [IsLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [currentUser, setCurrentUser] = useState<User>();
  const selectInput = useRef<HTMLSelectElement>(null);

  async function handleUpload() {
    if (!currentUser?.id) {
      alert("Please select a user before uploading.");
      return;
    }

    const formData = new FormData();
    if (currentUser?.id) formData.append("Id", currentUser.id);
    if (currentUser?.address) formData.append("Address", currentUser.address);
    if (currentUser?.city) formData.append("City", currentUser.city);
    if (currentUser?.state) formData.append("State", currentUser.state);
    if (currentUser?.country) formData.append("Country", currentUser.country);

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

  // TODO: Not working for input types
  function handleClear() {
    let id = currentUser?.id;
    setCurrentUser({
      id: id,
      address: "",
      city: "",
      state: "",
      country: "",
      profilePicture: "",
      resume: "",
    });
    pictureFileInput.current && (pictureFileInput.current.value = "");
    resumeFileInput.current && (resumeFileInput.current.value = "");
    setMessage(undefined);
    selectInput.current && (selectInput.current.selectedIndex = 0);
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
        setCurrentUser({...currentUser,id:id});
        return;
      }
      setIsLoading(false);
      setCurrentUser(data);
      setMessage(data);
      resumeFileInput.current && (resumeFileInput.current.value = "");
      pictureFileInput.current && (pictureFileInput.current.value = "");
    } catch (error) {
      console.error("Profile error:", error);
      setMessage(error);
      setCurrentUser({...currentUser,id:id});
      setIsLoading(false);
    }
  }

  function getAllUsers() {
    try {
      fetch("/api/users")
        .then((response) => response.json())
        .then((data) => {
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
    if (!value) {
      return;
    }
    setCurrentUser({...currentUser,id:value});
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
          <h1>Select User</h1>
          <select ref={selectInput} onChange={(e) => handleUserChange(e.target.value)}>
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
          <h1>Avatar</h1>
          <div>
                {currentUser?.profilePicture && (
                  <img
                    src={`data:image/jpeg;base64,${currentUser?.profilePicture}`}
                    alt="Profile Picture"
                  />
                )}
          </div>
        </div>

        <div className="user-details-form">
          <h1>User Details</h1>

          <div className="user-form-row">
            <div className="display-label">Address</div>
            <div className="app-input-text"><textarea value={currentUser?.address || ''} spellCheck="false" rows={5} cols={10} onChange={(e)=>{setCurrentUser({...currentUser,address:e.target.value})}} placeholder="Address" /></div>
          </div>

          <div className="user-form-row">
            <div className="display-label">City</div>
            <div className="app-input-text"><input value={currentUser?.city || ''} spellCheck="false" type="text" onChange={(e)=>{setCurrentUser({...currentUser,city:e.target.value})}} placeholder="City" /></div>
          </div>

          <div className="user-form-row">
            <div className="display-label">State</div>
            <div className="app-input-text"><input value={currentUser?.state || ''} spellCheck="false" type="text" onChange={(e)=>{setCurrentUser({...currentUser,state:e.target.value})}} placeholder="State" /></div>
          </div>

          <div className="user-form-row">
            <div className="display-label">Country</div>
            <div className="app-input-text"><input value={currentUser?.country || ''} spellCheck="false" type="text" onChange={(e)=>{setCurrentUser({...currentUser,country:e.target.value})}} placeholder="Country" /></div>
          </div>

          <div className="user-form-row">
            <div className="display-label">Profile Picture</div>
            <div className="app-input-file">
              <input type="file" ref={pictureFileInput} />
              {/* <button>+</button> */}
            </div>
          </div>

          <div className="user-form-row">
            <div className="display-label">Resume (pdf)</div>
            <div className="app-input-file">
              <input type="file" ref={resumeFileInput} />
              {/* <button>+</button> */}
            </div>
          </div>

          <div>
            <button className="app-button" onClick={handleUpload}>Save</button>
            <button className="app-button" onClick={handleClear}>Clear</button>
          </div>

        </div>

        {/* Users Resume */}
        <div className="user-resume">
          <h1>Resume</h1>
          <div>
            {currentUser?.resume && (
              <a href={`data:application/pdf;base64,${currentUser?.resume}`} download="resume.pdf">
                Download Resume
              </a>
            )}
          </div>
          <div className="embedResumePDF">
            {currentUser?.resume && (
              <embed src={`data:application/pdf;base64,${currentUser?.resume}`} width="100%" height="600px" />
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
