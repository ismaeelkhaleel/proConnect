import Userlayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { getAboutUser, loginUser, registerUser } from "@/config/redux/action/authAction";
import {reset, emptyMessage} from "@/config/redux/reducer/authReducer";
import { toast } from "react-toastify";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);

  const router = useRouter();

  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [email, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);
  
  useEffect(() => {
    if (authState.isSuccess && !userLoginMethod) { 
      setUserLoginMethod(true);
    }
  }, [authState.isSuccess]);
  

  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  const handleRegister = () => {
    console.log("Registering...");
    dispatch(registerUser({ username, password, email, name }));
  };

  const handleLogin = () => {
    console.log("Loging you...");
    dispatch(loginUser({email, password}));
  };

  return (
    <Userlayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <p className={styles.cardLeft_heading}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </p>

            <p style={{ color: authState.isError ? "red" : "green" }}>
              {authState.message}
            </p>

            <div className={styles.inputContainer}>
              {!userLoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                  />
                </div>
              )}
              <input
                onChange={(e) => setEmailAddress(e.target.value)}
                className={styles.inputField}
                type="email"
                placeholder="Email"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                type="password"
                placeholder="Password"
              />

              <div
                onClick={() => {
                  if (userLoginMethod) {
                    handleLogin();
                    toast.success("Login Successfull");
                  } else {
                    handleRegister();
                    toast.success("Sign up Successfull");
                  }
                }}
                className={styles.buttonWithOutline}
              >
                <p> {userLoginMethod ? "Sign In" : "Sign Up"}</p>
              </div>
            </div>
            <div  className={styles.changeMethod}>
              <p>{userLoginMethod?"Don't have an account?":"Already Have an Account?"}</p>
              <div
                onClick={() => {
                  setUserLoginMethod(!userLoginMethod);
                }}
                
              >
                <p style={{fontWeight:"bold", cursor:"pointer", color:"orange"}}> {userLoginMethod ? "Sign Up" : "Sign In"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Userlayout>
  );
}

export default LoginComponent;
