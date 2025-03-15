import clientServer, { BASE_URL } from "@/config";
import DashboardLayout from "@/layout/DashboardLayout";
import Userlayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllPosts,
  incrementPostLike,
  decrementPostLike,
  getAllComments,
  postComment,
  deleteComment,
} from "@/config/redux/action/postAction";
import { resetPostId } from "@/config/redux/reducer/postReducer";
import {
  getAllUsers,
  getConnectionsRequest,
  getMyConnectionsRequest,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";
import { toast } from "react-toastify";

export default function ViewProfilePage({ userProfile }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const postReducer = useSelector((state) => state.posts);
  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);
  const [isLike, setIsLike] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    dispatch(getAllPosts());
    dispatch(getConnectionsRequest({ token: localStorage.getItem("token") }));
    dispatch(getMyConnectionsRequest({ token: localStorage.getItem("token") }));
  }, [dispatch]);

  useEffect(() => {
    if (postReducer.posts.length > 0) {
      const userPosts = postReducer.posts.filter(
        (post) => post.userId.username === router.query.username
      );
      setUserPosts(userPosts);
    }
  }, [postReducer.posts, router.query.username]);

  useEffect(() => {
    if (
      authState.connections.some(
        (user) => user.connectionId?._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);

      if (
        authState.connections.find(
          (user) => user.connectionId?._id === userProfile.userId?._id
        ).status_accepted === true
      ) {
        setIsConnectionNull(false);
      }
    }
    if (
      authState.connectionRequest.some(
        (user) => user.userId?._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);

      if (
        authState.connectionRequest.find(
          (user) => user.userId?._id === userProfile.userId?._id
        ).status_accepted === true
      ) {
        setIsConnectionNull(false);
      }
    }
  }, [
    authState.connections,
    userProfile.userId._id,
    authState.connectionRequest,
  ]);

  const handleConnect = async () => {
    await dispatch(
      sendConnectionRequest({
        token: localStorage.getItem("token"),
        user_id: userProfile.userId._id,
      })
    );
    toast.success("Request Sent");
  };

  return (
    <Userlayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img
              className={styles.backDrop}
              src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              alt="backdrop"
            />
          </div>
          <div className={styles.profileContainer_details}>
            <div style={{ display: "flex", gap: "0.7rem" }}>
              <div>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  {userProfile.userId._id != authState.user.userId ? (
                    <div>
                      {isCurrentUserInConnection ? (
                        <button className={styles.connectedButton}>
                          {isConnectionNull ? "Pending" : "Connected"}
                        </button>
                      ) : (
                        <button
                          onClick={handleConnect}
                          className={styles.connectBtn}
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  ) : (
                    <button className={styles.connectedButton}>You</button>
                  )}
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={async () => {
                      const response = await clientServer.get(
                        `/user/download_resume?id=${userProfile.userId._id}`
                      );
                      window.open(`${BASE_URL}/${response.data.file}`);
                    }}
                  >
                    <svg
                      style={{ width: "1.2em" }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <p>{userProfile.bio}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.workHistory}>
            <h3>Work History</h3>
            <div className={styles.workHistoryContainer}>
              {userProfile.pastWork.map((work, index) => {
                return (
                  <div key={index} className={styles.workHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work.company}
                    </p>
                    <p>{work.position}</p>
                    <p>{work.years}+ Years</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={styles.workHistory}>
            <h3>Education</h3>
            <div className={styles.workHistoryContainer}>
              {userProfile.education.map((edu, index) => {
                return (
                  <div key={index} className={styles.workHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {edu.school}
                    </p>
                    <p>{edu.degree}</p>
                    <p>{edu.duration}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <hr></hr>
          <div>
            <h3 style={{ marginBottom: "1rem", marginTop: "1rem" }}>
              Recent Activity
            </h3>
            {userPosts.map((post) => (
              <div
                className={styles.postCard}
                key={post._id}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div className={styles.card}>
                  <div className={styles.card_profile}>
                    <img src={`${BASE_URL}/${post.userId.profilePicture}`} />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              marginBottom: "-1.3rem",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                router.push(
                                  `/view_profile/${post.userId.username}`
                                );
                              }}
                            >
                              {post.userId.name}
                            </span>
                            <b> &#x2022;</b>
                            <span style={{ fontWeight: "500" }}>
                              {" "}
                              {post.timeAgo}
                            </span>
                          </p>
                          <p>ismaeel</p>
                        </div>
                         
                      </div>
                    </div>
                  </div>
                  <p>{post.body}</p>
                  <div className={styles.card_profileContainer}>
                    {post.media ? (
                      <img src={`${BASE_URL}/${post.media}`} alt="post" />
                    ) : (
                      <div style={{ width: "3.4rem", height: "3.4rem" }}></div>
                    )}
                  </div>
                  <div className={styles.optionsContainer}>
                    <div
                      onClick={async () => {
                        if (isLike) {
                          await dispatch(
                            decrementPostLike({ post_id: post._id })
                          );
                          toast.warning("Like Removed");
                        } else {
                          await dispatch(
                            incrementPostLike({ post_id: post._id })
                          );
                          toast.success("Like Added");
                        }
                        setIsLike(!isLike);
                        dispatch(getAllPosts());
                      }}
                      className={styles.singleOption_optionsContainer}
                    >
                      {isLike ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          class="size-6"
                          style={{ color: "blue" }}
                        >
                          <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                          />
                        </svg>
                      )}
                      <p>{post.likes}</p>
                    </div>
                    <div
                      onClick={() => {
                        dispatch(getAllComments({ post_id: post._id }));
                      }}
                      className={styles.singleOption_optionsContainer}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                        />
                      </svg>
                    </div>
                    <div className={styles.singleOption_optionsContainer}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {postReducer.postId !== "" && (
            <div
              onClick={() => {
                dispatch(resetPostId());
              }}
              className={styles.commentsContainer}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={styles.allCommentsContainer}
              >
                <p
                  style={{
                    textAlign: "center",
                    position: "sticky",
                    top: "0",
                    zIndex: "7",
                    backgroundColor: "white",
                    padding: "0.5rem",
                  }}
                >
                  comments
                </p>
                {postReducer.comments.length === 0 && (
                  <p
                    style={{
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      height: "90%",
                    }}
                  >
                    <b>No Comments Yet</b>
                    <span style={{ opacity: "0.5" }}>
                      start the conversations
                    </span>
                  </p>
                )}

                {postReducer.comments.length !== 0 && (
                  <div>
                    {postReducer.comments.map((postComment, index) => {
                      return (
                        <div
                          className={styles.singleComment}
                          key={postComment._id}
                        >
                          <div
                            className={styles.singleComment_profileContainer}
                          >
                            <img
                              style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "50%",
                                objectFit: "cover",
                              }}
                              src={`${BASE_URL}/${postComment.userId.profilePicture}`}
                              alt="Profile"
                            />
                            <div
                              style={{
                                flex: 1,
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <p>
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "0.8rem",
                                    }}
                                  >
                                    {postComment.userId.name}
                                  </span>{" "}
                                  <b> &#x2022;</b>
                                  <span style={{ fontWeight: "500",fontSize:"0.7rem" }}>
                                    {" "}
                                    {postComment.timeAgo}
                                  </span>
                                </p>
                                <p>@{postComment.userId.username}</p>
                              </div>
                              {postComment.userId._id ===
                                authState.user.userId._id && (
                                <div
                                  onClick={async () => {
                                    await dispatch(
                                      deleteComment({
                                        token: localStorage.getItem("token"),
                                        comment_id: postComment._id,
                                      })
                                    );
                                     
                                    await dispatch(
                                      getAllComments({
                                        post_id: postComment.postId,
                                      })
                                    );
                                    toast.warning("Comment Deleted");
                                  }}
                                >
                                  <svg
                                    style={{
                                      height: "15px",
                                      color: "red",
                                      cursor: "pointer",
                                    }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                          <p>{postComment.body}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className={styles.postCommentContainer}>
                  <input
                    type=""
                    placeholder="Comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div
                    onClick={async () => {
                      await dispatch(
                        postComment({
                          post_id: postReducer.postId,
                          body: commentText,
                        })
                      );
                      await dispatch(
                        getAllComments({ post_id: postReducer.postId })
                      );
                      setCommentText("");
                      toast.success("Comment Added");
                    }}
                    className={styles.postCommentContainer_commentBtn}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      class="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </Userlayout>
  );
}

export async function getServerSideProps(context) {
  const { data } = await clientServer.get(
    "/user/get_profile_based_on_username",
    {
      params: { username: context.query.username },
    }
  );
  return { props: { userProfile: data.profile } };
}
