"use client";

import { url } from "inspector";
import { useEffect, useState } from "react";

export default function Page() {
    const [user, setUser] = useState('');
    const fetechUser = async () => {
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
            const res = await fetch(`/api/githubLogin`,{method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({code:code})});
            const data = await res.json();
            console.log(data);
            localStorage.setItem("github_token", JSON.stringify(data.details.access_token).replace(/"/g, ''));
            localStorage.setItem("userType", "github");
            window.location.href = "/";
            setUser(data);
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
