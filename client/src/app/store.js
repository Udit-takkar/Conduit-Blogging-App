import { configureStore } from "@reduxjs/toolkit";
import signup from "../features/authentication/signup";
import articleSlice from "../features/articles/articleSlice";

export const store = configureStore({
  reducer: {
    signup,
    articleSlice,
  },
});
