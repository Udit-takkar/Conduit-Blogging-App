import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../features/authentication/authSlice.js";
import articleSlice from "../features/articles/articleSlice";

export const store = configureStore({
  reducer: {
    authSlice,
    articleSlice,
  },
});
