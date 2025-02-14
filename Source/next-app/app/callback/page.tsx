"use client";

import { setUserSlice } from "@/store/slices/userSlices";
import { useAppDispatch } from "@/store/store";
import { url } from "inspector";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast, { Toaster } from 'react-hot-toast';
import { setToastSlice } from "@/store/slices/toastSlices";

export default function Page() {
    const dispatch = useAppDispatch();
    const router = useRouter()
    function setStateForGoogleUser(data: any) {
        const user = {...data.details};

        const google_token = localStorage.getItem("google_token");
        fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
          headers: {
            Authorization: `Bearer ${google_token}`
          }
        }).then((res) => res.json()).then((data) => {
          console.log(data);
          user.login = data.email;
          user.avatar_url = data.picture;
          user.name = data.name;
          user.picture = data.picture

          dispatch(setUserSlice(user));
          dispatch(setToastSlice({message: "Login successful", type: 0}));
          console.log("user dispatched", user);
          toast.success("Login successful " + user.login);

          setTimeout(() => {
            router.push("/");
          }, 2000);
        });
    }

    function setStateForGithubUser(data: any) {
        const user = {...data.details};

        const github_token = localStorage.getItem("github_token");
        fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${github_token}`
          }
        }).then((res) => res.json()).then((data) => {
          console.log(data);
          user.login = data.email;
          user.avatar_url = data.avatar_url;
          user.name = data.name;
          user.picture = data.avatar_url

          dispatch(setUserSlice(user));
          dispatch(setToastSlice({message: "Login successful", type: 0}));
          console.log("user dispatched", user);
          toast.success("Login successful " + user.login);
          setTimeout(() => {
            router.push("/");
          }, 2000);
        });
    }

    async function fetchGoogleUser(code: string) {
        const res = await fetch(`/api/callback`,{method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({code:code, thirdParty: "google"})});
        const data = await res.json();
        console.log(data);
        localStorage.setItem("google_token", JSON.stringify(data.details.access_token).replace(/"/g, ''));
        localStorage.setItem("userType", "google");
        //router.push("/");
        setStateForGoogleUser(data);
    }

     async function fetchGithubUser(code: string) {
        const res = await fetch(`/api/callback`,{method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({code:code, thirdParty: "github"})});
        const data = await res.json();
        console.log(data);
        localStorage.setItem("github_token", JSON.stringify(data.details.access_token).replace(/"/g, ''));
        localStorage.setItem("userType", "github");
        //router.push("/");
        setStateForGithubUser(data);
    }

    const fetchUser = async () => {

        const code = new URLSearchParams(window.location.search).get("code");
        const thirdParty = new URLSearchParams(window.location.search).get("thirdParty");

        if (!code) {
            console.log("no code to fetch user");
            return;
        }
        switch (thirdParty) {
            case "google":
                fetchGoogleUser(code);
                break;
            case "github":
                fetchGithubUser(code);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

  return (
    <div>
      <h1>Redirecting...</h1>
      <div><Toaster position="top-right" reverseOrder={false} /></div>
    </div>
  );
}
