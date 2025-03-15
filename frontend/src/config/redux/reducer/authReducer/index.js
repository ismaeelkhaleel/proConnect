import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUsers,
  getConnectionsRequest,
  getMyConnectionsRequest,
  loginUser,
  registerUser,
  sendConnectionRequest,
} from "../../action/authAction"; // Ensure correct import

const initialState = {
  user: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isTokenThere: false,
  profileFetched: false,
  connections: [], // Array of connections
  connectionRequest: [], // Array of connection requests
  all_users: [],
  all_profiles_fetched: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleloginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setTokenIsThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.loggedIn = false;
      state.profileFetched = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Knocking the door...";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "Login Successful";
        state.user = action.payload; // Assuming payload contains user data
        if (action.payload.token) {
          state.isTokenThere = true;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.error.message || "Login Failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering You...";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = false;
        state.message = "Registration Successful, please login";
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.error.message || "Registration Failed";
        console.error("Registration failed with payload:", action.payload);
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload.profile;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetched = true;
        state.all_users = action.payload.profiles;
      })
      .addCase(getConnectionsRequest.fulfilled, (state, action) => {
        console.log("Connections payload:", action.payload);
        state.connections = action.payload;
      })
      .addCase(getConnectionsRequest.rejected, (state, action) => {
        state.message = action.error.message || "Failed to fetch connections";
      })
      .addCase(getMyConnectionsRequest.fulfilled, (state, action) => {
        console.log("My Connections payload second:", action.payload);
        state.connectionRequest = action.payload;
      })
      .addCase(getMyConnectionsRequest.rejected, (state, action) => {
        state.message =
          action.error.message || "Failed to fetch connection requests";
      })
      .addCase(sendConnectionRequest.fulfilled, (state, action) => {
        console.log("New connection payload:", action.payload);
        state.connections = [...state.connections, action.payload]; // Add the new connection object
        state.message = "Connection request sent successfully";
      })
      .addCase(sendConnectionRequest.rejected, (state, action) => {
        state.message =
          action.error.message || "Failed to send connection request";
      });
  },
});

export const {
  reset,
  emptyMessage,
  setTokenIsNotThere,
  setTokenIsThere,
  logoutUser,
} = authSlice.actions;

export default authSlice.reducer;