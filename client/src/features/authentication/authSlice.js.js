import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { updateUser, registerUser, loginUser } from "../../services/user";

let initialState = {
  loading: false,
  error: null,
  isLoggedIn: false,
  username: "",
  email: "",
  bio: "",
  image: null,
};
const user = JSON.parse(localStorage.getItem("user"))
  ? JSON.parse(localStorage.getItem("user"))
  : null;

if (user) {
  initialState = {
    loading: false,
    error: null,
    isLoggedIn: true,
    username: user.username,
    email: user.email,
    bio: user.bio,
    image: user.image,
  };
}
export const signup = createAsyncThunk("signup/register", registerUser);

export const login = createAsyncThunk("signup/login", loginUser);

export const update = createAsyncThunk("signup/update", updateUser);

export const SignUpSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    logoutUser: (state, action) => {
      localStorage.removeItem("user");
      Object.assign(state, {
        loading: false,
        error: null,
        isLoggedIn: false,
        username: "",
        email: "",
        bio: "",
        image: null,
      });
    },
  },
  extraReducers: {
    [signup.pending]: (state, action) => {
      Object.assign(state, {
        loading: true,
        error: null,
        isLoggedIn: false,
        username: "",
        email: "",
        bio: "",
        image: null,
      });
    },
    [signup.fulfilled]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: null,
        isLoggedIn: true,
        username: action.payload.user.username,
        email: action.payload.user.email,
        bio: action.payload.user.bio,
        image: action.payload.user.image,
      });
    },
    [signup.rejected]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: { page: "signup", error: action.payload.data.errors },
        isLoggedIn: false,
        username: "",
        email: "",
        bio: "",
        image: null,
      });
    },
    [login.pending]: (state, action) => {
      Object.assign(state, {
        loading: true,
        error: null,
        isLoggedIn: false,
        username: "",
        email: "",
        bio: "",
        image: null,
      });
    },
    [login.fulfilled]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: null,
        isLoggedIn: true,
        username: action.payload.user.username,
        email: action.payload.user.email,
        bio: action.payload.user.bio,
        image: action.payload.user.image,
      });
    },
    [login.rejected]: (state, action) => {
      Object.assign(state, {
        loading: false,
        // error: { page: "signin", error: action.payload.data.errors },
        error: null,
        isLoggedIn: false,
        username: "",
        email: "",
        bio: "",
        image: null,
      });
    },
    [update.pending]: (state, action) => {},
    [update.fulfilled]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: null,
        isLoggedIn: true,
        username: action.payload.user.username,
        email: action.payload.user.email,
        bio: action.payload.user.bio,
        image: action.payload.user.image,
      });
    },
    [update.rejected]: (state, action) => {},
  },
});

export const isUserLoggedIn = (state) => state.authSlice.isLoggedIn;
export const isLoading = (state) => state.authSlice.loading;
export const error = (state) => {
  return state.authSlice.error;
};
export const getUsername = (state) => state.authSlice.username;
export const getUserEmail = (state) => state.authSlice.email;
export const getUserImg = (state) => state.authSlice.image;
export const getUserBio = (state) => state.authSlice.bio;
export const getUserToken = (state) => state.authSlice.token;
export const { logoutUser } = SignUpSlice.actions;
export default SignUpSlice.reducer;
