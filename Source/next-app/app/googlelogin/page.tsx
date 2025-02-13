"use client";

import { setUserSlice } from "@/store/slices/userSlices";
import { useAppDispatch } from "@/store/store";
import { url } from "inspector";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Page() {
    const [user, setUser] = useState('');
    const dispatch = useAppDispatch();
    const router = useRouter()
    function setStateForGoogleUser(data: any) {


        const user = {
            login: data.details.email,
            avatar_url: data.details.picture,
            name: data.details.name,
            picture: data.details.picture
        }
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
          console.log("user dispatched", user);
          router.push("/");
        });
    }

    const fetechUser = async () => {
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
            const res = await fetch(`/api/googlelogin`,{method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({code:code})});
            const data = await res.json();
            console.log(data);
            localStorage.setItem("google_token", JSON.stringify(data.details.access_token).replace(/"/g, ''));
            localStorage.setItem("userType", "google");
            setUser(data);
            setStateForGoogleUser(data);

        }
    };
    useEffect(() => {
        fetechUser();

    }, []);

  return (
    <div>
      <h1>Login in</h1>
    </div>
  );
}
