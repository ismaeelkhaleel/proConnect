import React, { useEffect } from "react";
import Userlayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/config/redux/action/authAction";
import styles from "./style.module.css";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";
export default function Discover() {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, []);

  return (
    <Userlayout> 
      <DashboardLayout>
        <div style={{flex:1}}>
          <h3 style={{marginBottom:"1rem"}}>Discover And Connect People</h3>
          <div className={styles.allUserProfile}>
            {authState.all_profiles_fetched &&
              authState.all_users.map((user) => {
                return (
                  <div onClick={()=> {
                    router.push(`/view_profile/${user.userId.username}`)
                  }} key={user._id} className={styles.userCard}>
                    <img className={styles.userCard_image}
                      src={`${BASE_URL}/${user.userId.profilePicture}`}
                      alt={user.name}
                    />
                    <div>
                      <h4>{user.userId.name}</h4>
                      <h5 style={{opacity:"0.5"}}>{user.userId.username}</h5>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </DashboardLayout>
    </Userlayout>
  );
}
