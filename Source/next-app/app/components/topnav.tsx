"use client";

import "../components/components.css";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setUserSlice } from "../../store/slices/userSlices";
import {User} from "../models/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import React from "react";
import TopNavUser from "./topNavUser";

function TopNav() {
  const userValue:User = useAppSelector((state) => state.user);


  return (
    <div className="topnav">

        <div className="topnav-logo">
          <img src="/static/images/logo.png" alt="logo" />
        </div>

        <div className="topnav-pages">
          <Link href="/">Home</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/video">Video</Link>
          <Link href="/upload">Upload</Link>
            {
              !userValue?.name &&
              <React.Fragment key={"topnav-register"}>
                <Link href="/register">Register</Link>
                <Link href="/login">Login</Link>
              </React.Fragment>
            }
        </div>
        <TopNavUser />
    </div>
  );
}
export default TopNav;
