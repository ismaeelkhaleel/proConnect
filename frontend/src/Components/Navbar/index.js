import React, { useEffect } from "react";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/config/redux/reducer/authReducer";
import { getAboutUser } from "@/config/redux/action/authAction";
import { toast } from "react-toastify";
import { BASE_URL } from "@/config";

function NavbarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (authState.loggedIn && !authState.profileFetched) {
      dispatch(getAboutUser());
    }
  }, [authState.loggedIn, authState.profileFetched, dispatch]);

  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1
          style={{ cursor: "pointer" }}
          onClick={() => {
            router.push("/");
          }}
        >
          Pro Connect
        </h1>

        <div className={styles.navBarOptionsContainer}>
          {authState.profileFetched && (
            <div>
              <div style={{ display: "flex", gap: "1.2rem", alignItems:"center" }}>
                <p
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                  onClick={() => {
                    localStorage.removeItem("token");
                    dispatch(logoutUser());
                    router.push("/login");
                    toast.warning("Log out Successfully");
                  }}
                >
                  LogOut
                </p>
                
                <p
                  onClick={() => {
                    router.push("/profile");
                  }}
                  style={{ fontWeight: "bold", cursor: "pointer" }}
                >
                <img title="Profile" style={{width:"40px",height:"40px", borderRadius:"50%", objectFit:"cover", border:"2px solid black"}} src={`${BASE_URL}/${authState.user.userId.profilePicture}`}/>
                </p>
              </div>
            </div>
          )}
          {!authState.profileFetched && (
            <div
              onClick={() => {
                router.push("/login");
              }}
              className={styles.buttonJoin}
            >
              <p>Be a part</p>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavbarComponent;
