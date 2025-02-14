"use client";

import "../components/components.css";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { setUserSlice } from "../../store/slices/userSlices";
import {User} from "../models/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function TopNav() {
  const userValue:User = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter()

  function logout() {
    localStorage.removeItem("userType");
    localStorage.removeItem("github_token");
    localStorage.removeItem("google_token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("latestCSRFToken");
    dispatch(setUserSlice({}));
    toast.success("Logout successful");
    router.push("/login");
  }

  return (
    <div className="topnav">

      <Link href="/">Home</Link>
          <Link href="/admin">Admin</Link>


        {
          !userValue?.name &&
          <>
          <Link href="/register">Register</Link>
          <Link href="/login">Login</Link>

          </>
        }


        {userValue?.name && <><span>{userValue?.name}</span> <a style={{cursor:"pointer"}} onClick={logout}>Logout</a></>}

        <img src={userValue?.avatar_url ? userValue?.avatar_url : '/static/images/avatar_logoff.avif'} alt="avatar" referrerPolicy="no-referrer" />


    </div>
  );
}
export default TopNav;
