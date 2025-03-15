import React, { useEffect } from "react";
import Userlayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  acceptConnections,
  getMyConnectionsRequest,
} from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { connection } from "next/server";
import { toast } from "react-toastify";


export default function MyConnections() {
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyConnectionsRequest({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    if (authState.connectionRequest.length != 0) {
      console.log(authState.connectionRequest);
    }
  }, [authState.connectionRequest]);
  return (
    <Userlayout>
      <DashboardLayout>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.7rem" }}
        >
          <h3>My Connections</h3>
          {authState.connectionRequest.length === 0 && (
            <p>No Connection Request Pending</p>
          )}
          {authState.connectionRequest.length != 0 &&
            authState.connectionRequest
              .filter((connection) => connection.status_accepted === null)
              .map((user, index) => {
                return (
                  <div className={styles.userCard} key={index}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className={styles.profilePicture}>
                        <img
                          src={`${BASE_URL}/${user.userId.profilePicture}`}
                          alt="profilePic"
                          style={{
                            height: "50px",
                            width: "50px",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                      <div className={styles.userInfo}>
                        <h3
                          onClick={() => {
                            router.push(
                              `/view_profile/${user.userId.username}`
                            );
                          }}
                          style={{ color: "blue", cursor: "pointer" }}
                        >
                          {user.userId.name}
                        </h3>
                        <p>{user.userId.username}</p>
                      </div>
                      <button
                        onClick={() => {
                          dispatch(
                            acceptConnections({
                              connectionId: user._id,
                              token: localStorage.getItem("token"),
                              action: "accept",
                            })
                          );
                          toast.success("Accepted")
                        }}
                        className={styles.connectedButton}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                );
              })}
          <h3>My Network</h3>
          {authState.connectionRequest
            .filter((connection) => connection.status_accepted !== null)
            .map((user, index) => {
              return (
                <div className={styles.userCard} key={index}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className={styles.profilePicture}>
                      <img
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        alt="profilePic"
                        style={{
                          height: "50px",
                          width: "50px",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                    <div className={styles.userInfo}>
                      <h3
                        onClick={() => {
                          router.push(`/view_profile/${user.userId.username}`);
                        }}
                        style={{ color: "blue", cursor: "pointer" }}
                      >
                        {user.userId.name}
                      </h3>
                      <p>{user.userId.username}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </DashboardLayout>
    </Userlayout>
  );
}
