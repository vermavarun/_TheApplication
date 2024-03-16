"use client"
import styles from "./page.module.css";
import { useEffect, useState } from "react";

export default function Home() {

const [apivalue,setValue] = useState({});

useEffect(() => {
  console.log('Hello world');
  fetch('/api/users')
  .then(response => response.json())
  .then(data => {
   setValue(data);
  })
  .catch(error => console.log('Error:', error));

}
, []);

  return (
    <main className={styles.main}>

    {apivalue.name}

    </main>
  );
}
