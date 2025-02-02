"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [registered, setRegistered] = useState({});

    function register() {
        console.log("Registering");
        fetch("/api/register")
          .then((response) => response.json())
          .then((data) => {
            setRegistered(data);
          })
          .catch((error) => console.log("Error:", error));
      }

  return (
    <main className={styles.main}>
        <div>
            <div>Username</div>
            <input type="text" />
            <div>Password</div>
            <input type="password" />
            <input type="submit" value="Register" onClick={register}/>
        </div>

    </main>
  );
}
