import { setUserSlice } from "@/store/slices/userSlices";
import { useAppDispatch, useAppSelector } from "@/store/store";
import toast from "react-hot-toast";
import { User } from "../models/user";
import { useRouter } from "next/navigation";

function TopNavUser() {
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
    <div className="topnav-user">
            <div className="topnav-user-avatar">
              <img src={userValue?.avatar_url ? userValue?.avatar_url : '/static/images/avatar_logoff.avif'} alt="avatar" referrerPolicy="no-referrer" />
            </div>

            {userValue?.name && <><div className="topnav-user-name">{userValue?.name}</div> <div className="topnav-user-logout" style={{cursor:"pointer"}} onClick={logout}>Logout</div></>}
    </div>
  );
}

function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
}

export default TopNavUser;
