"use client";

import "../components/components.css";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setUserSlice } from "../../store/slices/userSlices";
import {User} from "../models/user";
import Link from "next/link";
import { useRouter } from "next/navigation";

function TopNav() {
  const userValue = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter()

  function logout() {
    localStorage.removeItem("userType");
    localStorage.removeItem("github_token");
    localStorage.removeItem("google_token");
    localStorage.removeItem("accessToken");
    //dispatch(setUserSlice({}));
    router.push("/login");
  }

  return (
    <div className="topnav">

      <Link href="/">Home</Link>
        <span>
          <Link href="/admin">Admin</Link>
          <a style={{cursor:"pointer"}} onClick={logout}>Logout</a>
        </span>

        <span>
          <Link href="/register">Register</Link>
          <Link href="/login">Login</Link>
        </span>

      <span>Welcome {userValue.name}</span>
      <img src={userValue.avatar_url !== '' ? userValue.avatar_url : '/static/images/avatar_logoff.avif'} alt="avatar" referrerPolicy="no-referrer" />


    </div>
  );
}
export default TopNav;
