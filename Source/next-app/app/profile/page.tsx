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
    console.log("handleUpload called, currentUser:", currentUser);

    if (!currentUser?.id) {
      console.log("No currentUser or ID found");
      toast.error("Please select a user before uploading.");
      alert("Please select a user before uploading.");
      return;
    }

    console.log("Creating FormData with user ID:", currentUser.id);
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
      const response = await fetch("api/profile", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setMessage(data);
      console.log(data);

      if (response.status === 200) {
        toast.success("Upload successful");
      }
      else if (response.status === 404) {
        toast.error("Profile creation failed - user profile endpoint may not be properly configured");
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

  function handleClear() {
    let id = currentUser?.id;
    setCurrentUser({
      id: id || "",
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

      if (response.status === 404) {
        // User doesn't have profile data yet - this is normal for new users
        console.log("No profile data found for user, creating empty profile");
        const selectedUser = Object.values(users).find((user: User) => user.id === id);
        if (selectedUser) {
          setCurrentUser({
            ...selectedUser,
            address: "",
            city: "",
            state: "",
            country: "",
            profilePicture: "",
            resume: ""
          });
        }
        toast.success("No profile found. You can create one by filling the form and clicking Save.");
        setMessage({ info: "No profile data found. You can create one by filling the form and clicking Save." });
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        // Handle other HTTP errors (not 404 since we handled that above)
        console.error("Profile API error:", response.status, response.statusText);
        toast.error("Error fetching profile details");
        setIsLoading(false);
        const selectedUser = Object.values(users).find((user: User) => user.id === id);
        if (selectedUser) {
          setCurrentUser(selectedUser);
        }
        return;
      }

      const data = await response.json();
      console.log("Profile data:", data);
      setIsLoading(false);
      setCurrentUser(data);
      setMessage(data);
      resumeFileInput.current && (resumeFileInput.current.value = "");
      pictureFileInput.current && (pictureFileInput.current.value = "");
    } catch (error) {
      console.error("Profile error:", error);
      setMessage(error);
      // Set basic user info if profile fetch fails
      const selectedUser = Object.values(users).find((user: User) => user.id === id);
      if (selectedUser) {
        setCurrentUser(selectedUser);
      }
      setIsLoading(false);
    }
  }

  function getAllUsers() {
    try {
      fetch("/api/users")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Users fetched successfully:", data);
          console.log("First user structure:", data[0]);
          console.log("Users array length:", data.length);

          // Convert array to object with ID as key for easier lookup
          const usersObj = data.reduce((acc: Record<string, User>, user: User) => {
            if (user.id) {
              acc[user.id] = user;
            }
            return acc;
          }, {});

          console.log("Converted users object:", usersObj);
          setUsers(usersObj);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          toast.error('Error fetching users: ' + error.message);
          setUsers({});
        });
    } catch (e) {
      console.error("Fetch users error:", e);
      toast.error('Error fetching users');
    }
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  function handleUserChange(value: string): void {
    if (!value) {
      setCurrentUser(undefined);
      setMessage(undefined);
      return;
    }

    console.log("User selected:", value);

    // Find the selected user from users list
    const selectedUser = Object.values(users).find((user: User) => user.id === value);
    if (selectedUser) {
      console.log("Found user:", selectedUser);
      // Set basic user info immediately
      setCurrentUser({
        ...selectedUser,
        address: "",
        city: "",
        state: "",
        country: "",
        profilePicture: "",
        resume: ""
      });
    }

    // Get profile details for the selected user (this may return 404 for new users)
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
            <div className="app-input-text"><textarea value={currentUser?.address || ''} spellCheck="false" rows={5} cols={10} onChange={(e)=>{setCurrentUser({...currentUser, id: currentUser?.id || '', address:e.target.value})}} placeholder="Address" /></div>
          </div>

          <div className="user-form-row">
            <div className="display-label">City</div>
            <div className="app-input-text"><input value={currentUser?.city || ''} spellCheck="false" type="text" onChange={(e)=>{setCurrentUser({...currentUser, id: currentUser?.id || '', city:e.target.value})}} placeholder="City" /></div>
          </div>

          <div className="user-form-row">
            <div className="display-label">State</div>
            <div className="app-input-text"><input value={currentUser?.state || ''} spellCheck="false" type="text" onChange={(e)=>{setCurrentUser({...currentUser, id: currentUser?.id || '', state:e.target.value})}} placeholder="State" /></div>
          </div>

          <div className="user-form-row">
            <div className="display-label">Country</div>
            <div className="app-input-text"><input value={currentUser?.country || ''} spellCheck="false" type="text" onChange={(e)=>{setCurrentUser({...currentUser, id: currentUser?.id || '', country:e.target.value})}} placeholder="Country" /></div>
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
