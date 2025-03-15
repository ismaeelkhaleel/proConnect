import { getAboutUser } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/DashboardLayout";
import Userlayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import clientServer, { BASE_URL } from "@/config";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import {
  getAllComments,
  getAllPosts,
  postComment,
  incrementPostLike,
  deletePost,
  deleteComment,
  decrementPostLike,
} from "@/config/redux/action/postAction";
import { resetPostId } from "@/config/redux/reducer/postReducer";
export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEducationModal, setIsEducationModal] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [educationData, setEducationData] = useState({
    school: "",
    degree: "",
    duration: "",
  });
  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });

  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.posts);
  const [commentText, setCommentText] = useState("");

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };
  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    setEducationData({ ...educationData, [name]: value });
  };

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts);
  }, []);

  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);
      let post = postReducer.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
      });
      setUserPosts(post);
    }
  }, [authState.user, postReducer.posts]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    const response = await clientServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    toast.success("Profile Picture Updated");
  };

  const updateProfileData = async () => {
    const request = await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    const response = await clientServer.post("update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    toast.success("Profile Updated Successfully");
  };

  return (
    <Userlayout>
      <DashboardLayout>
        <div className={styles.container}>
          {authState.user && userProfile.userId && (
            <div>
              <div className={styles.backDropContainer}>
                <div className={styles.backDrop_overlay}>
                  <label htmlFor="profilePictureUpload">
                    <svg
                      style={{ width: "4rem", cursor: "pointer" }}
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
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </label>
                  <input
                    onChange={(e) => {
                      updateProfilePicture(e.target.files[0]);
                    }}
                    type="file"
                    id="profilePictureUpload"
                    hidden
                  />
                </div>
                <img
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
                      }}
                    >
                      <input
                        className={styles.nameEdit}
                        type="text"
                        value={userProfile.userId.name}
                        onChange={(e) => {
                          setUserProfile({
                            ...userProfile,
                            userId: {
                              ...userProfile.userId,
                              name: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>

                    <div>
                      <textarea
                        value={userProfile.bio}
                        onChange={(e) => {
                          setUserProfile({
                            ...userProfile,
                            bio: e.target.value,
                          });
                        }}
                        rows={Math.max(
                          3,
                          Math.ceil(userProfile.bio.length / 80)
                        )}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.workHistory}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h3>Work History</h3>
                  <svg
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                    style={{ width: "2em", cursor: "pointer" }}
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
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>

                <div className={styles.workHistoryContainer}>
                  {userProfile.pastWork.map((work, index) => {
                    return (
                      <div key={index} className={styles.workHistoryCard}>
                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.8rem",
                            fontWeight: "bold",
                          }}
                        >
                          {work.company}
                        </p>
                        <p>{work.position}</p>
                        <p style={{ color: "blue" }}>{work.years}+ Years </p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={styles.workHistory}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <h3>Education</h3>
                  <svg
                    onClick={() => {
                      setIsEducationModal(true);
                    }}
                    style={{ width: "2em", cursor: "pointer" }}
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
                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <div className={styles.workHistoryContainer}>
                  {userProfile.education.map((edu, index) => {
                    return (
                      <div key={index} className={styles.workHistoryCard}>
                        <p
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.8rem",
                            fontWeight: "bold",
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
              {userProfile != authState.user && (
                <div
                  onClick={() => {
                    updateProfileData();
                  }}
                  className={styles.updateProfileBtn}
                >
                  Update Profile
                </div>
              )}
            </div>
          )}
          {isModalOpen && (
            <div
              onClick={() => {
                setIsModalOpen(false);
              }}
              className={styles.commentsContainer}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={styles.addWork}
              >
                <input
                  onChange={handleWorkInputChange}
                  name="company"
                  className={styles.inputField}
                  type="text"
                  placeholder="Enter Company Name"
                />
                <input
                  onChange={handleWorkInputChange}
                  name="position"
                  className={styles.inputField}
                  type="text"
                  placeholder="Enter Position Name"
                />
                <input
                  onChange={handleWorkInputChange}
                  name="years"
                  className={styles.inputField}
                  type="number"
                  placeholder="Enter Years of Experience"
                />
                <div
                  onClick={() => {
                    setUserProfile({
                      ...userProfile,
                      pastWork: [...userProfile.pastWork, inputData],
                    });
                    setIsModalOpen(false);
                  }}
                  className={styles.updateProfileBtn}
                >
                  Add Work
                </div>
              </div>
            </div>
          )}
          {isEducationModal && (
            <div
              onClick={() => {
                setIsEducationModal(false);
              }}
              className={styles.commentsContainer}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={styles.addWork}
              >
                <input
                  onChange={handleEducationInputChange}
                  name="school"
                  className={styles.inputField}
                  type="text"
                  placeholder="Enter School Name"
                />
                <input
                  onChange={handleEducationInputChange}
                  name="degree"
                  className={styles.inputField}
                  type="text"
                  placeholder="Enter Degree Name e.g: BSc, MSc, etc."
                />
                <input
                  onChange={handleEducationInputChange}
                  name="duration"
                  className={styles.inputField}
                  type="text"
                  placeholder="Enter Duration of Study e.g: 2010-2014"
                />
                <div
                  onClick={() => {
                    setUserProfile({
                      ...userProfile,
                      education: [...userProfile.education, educationData],
                    });
                    setIsEducationModal(false);
                  }}
                  className={styles.updateProfileBtn}
                >
                  Add Education
                </div>
              </div>
            </div>
          )}
          <div>
            <h3 style={{ marginBottom: "1rem", marginTop: "1rem" }}>
              Recent Activity
            </h3>
            {userPosts.map((post) => (
              <div className={styles.postCard} key={post._id}>
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
                          <p style={{ marginBottom: "-1.3rem" }}>
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
                              {" "}
                              {post.userId.name}
                            </span>{" "}
                            <b>&#x2022;</b>{" "}
                            <span style={{ fontWeight: "500" }}>
                              {post.timeAgo}
                            </span>
                          </p>
                          <p>@{post.userId.username}</p>
                        </div>
                        <div
                          onClick={async () => {
                            await dispatch(
                              deletePost({
                                token: localStorage.getItem("token"),
                                post_id: post._id,
                              })
                            );
                            await dispatch(getAllPosts());
                          }}
                        >
                          <svg
                            style={{
                              height: "20px",
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
                          toast.success("Like Removed");
                        } else {
                          await dispatch(
                            incrementPostLike({ post_id: post._id })
                          );
                          toast.warning("Like Added");
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
