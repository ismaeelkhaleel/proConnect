import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import {
  createPost,
  getAllPosts,
  deletePost,
  incrementPostLike,
  getAllComments,
  postComment,
  deleteComment,
  decrementPostLike,
} from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Userlayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./Style.module.css";
import { BASE_URL } from "@/config";
import { resetPostId } from "@/config/redux/reducer/postReducer";
import { toast } from "react-toastify";

export default function Dashboard() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const postState = useSelector((state) => state.posts);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token }));
    }
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, [dispatch, authState.all_profiles_fetched]);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();
  const [commentText, setCommentText] = useState("");
  const [isLike, setIsLike] = useState(false);

  const handleUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setFileContent(null);
    setPostContent("");
    dispatch(getAllPosts());
    toast.success("Posted Successfully");
  };

  if (!authState.user || !authState.user.userId) {
    return (
      <Userlayout>
        <DashboardLayout>
          <h2>Loading...</h2>
        </DashboardLayout>
      </Userlayout>
    );
  }

  const profilePicture =
    authState.user?.userId?.profilePicture || "default-image-url";

  return (
    <Userlayout>
      <DashboardLayout>
        <div className={styles.scrollComponent}>
          <div className={styles.wrapper}>
            <div className={styles.createPostContainer}>
              <img
                className={styles.userProfile}
                src={`${BASE_URL}/${profilePicture}`}
                alt="Profile"
              />
              <textarea
                onChange={(e) => setPostContent(e.target.value)}
                value={postContent}
                placeholder={"What's in your mind?"}
                className={styles.textAreaContent}
              ></textarea>
              <label htmlFor="fileUpload">
                <div className={styles.Fab}>
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
                      d="M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                    />
                  </svg>
                </div>
              </label>
              <input
                onChange={(e) => setFileContent(e.target.files[0])}
                type="file"
                hidden
                id="fileUpload"
              />
              {postContent.length > 0 && (
                <div onClick={handleUpload} className={styles.uploadButton}>
                  Post
                </div>
              )}
            </div>
            <div className={styles.postsContainer}>
              {postState.posts.map((post) => {
                return (
                  <div key={post._id} className={styles.singleCard}>
                    <div className={styles.singleCard_profileContainer}>
                      <img
                        className={styles.userProfile}
                        src={`${BASE_URL}/${post.userId.profilePicture}`}
                        alt="Profile"
                      />
                      <div style={{ flex: 1 }}>
                        {" "}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "1.2rem",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              router.push(
                                `/view_profile/${post.userId.username}`
                              );
                            }}
                          >
                            <p>
                              <span style={{ fontWeight: "bold" }}>
                                {post.userId.name}{" "}
                              </span>
                              <b>&#x2022;</b>
                              <span style={{ display: "500" }}>
                                {" "}
                                {post.timeAgo}
                              </span>
                            </p>
                          </div>
                          {post.userId._id === authState.user.userId._id && (
                            <div
                              onClick={async () => {
                                await dispatch(
                                  deletePost({
                                    token: localStorage.getItem("token"),
                                    post_id: post._id,
                                  })
                                );
                                await dispatch(getAllPosts());
                                toast.warning("Post Deleted");
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
                          )}
                        </div>
                        <p style={{ color: "grey", marginTop: "0" }}>@{post.userId.username}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p style={{ marginLeft: "10px", marginTop: "-0.5rem" }}>
                        {post.body}
                      </p>
                      <div className={styles.singleCard_image}>
                        <img src={`${BASE_URL}/${post.media}`} alt="Post" />
                      </div>
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
                );
              })}
            </div>
          </div>
        </div>
        {postState.postId !== "" && (
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
              {postState.comments.length === 0 && (
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

              {postState.comments.length !== 0 && (
                <div>
                  {postState.comments.map((postComment, index) => {
                    return (
                      <div
                        className={styles.singleComment}
                        key={postComment._id}
                      >
                        <div className={styles.singleComment_profileContainer}>
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
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
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
                                  <span
                                    style={{
                                      fontWeight: "500",
                                      fontSize: "0.7rem",
                                    }}
                                  >
                                    {" "}
                                    {postComment.timeAgo}
                                  </span>
                                </p>
                                <p style={{fontSize:"0.8rem", opacity:"0.7"}}>@{postComment.userId.username}</p>
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
                                    toast.warning("Comment deleted");
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
                        post_id: postState.postId,
                        body: commentText,
                      })
                    );
                    await dispatch(
                      getAllComments({ post_id: postState.postId })
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
      </DashboardLayout>
    </Userlayout>
  );
}
