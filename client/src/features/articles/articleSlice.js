import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../config/api.config";

const initialState = {
  loading: false,
  error: null,
  articles: [],
  articlesCount: 0,
  navItems: ["Your Feed", "Global Feed"],
  activeItem: "Global Feed",
};

export const fetchFeedArticles = createAsyncThunk(
  "articles/feed",
  async (page, { getState }) => {
    try {
      const response = await axios.get(
        `/articles/feed?limit=10&offset=${(page - 1) * 10}`
      );

      return response.data;
    } catch (e) {
      console.log(e.response);
      return e;
    }
  }
);
export const fetchGlobalArticles = createAsyncThunk(
  "articles/global",
  async (page, { getState }) => {
    console.log(getState());
    try {
      console.log("Fetch global");
      const response = await axios.get(
        `/articles?limit=10&offset=${(page - 1) * 10}`
      );
      console.log(response.data);
      return response.data;
    } catch (e) {
      console.log(e.response);
      return e;
    }
  }
);

export const fetchArticlesByTag = createAsyncThunk(
  "articles/tag",

  async ({ page, tag }) => {
    // console.log(getState().articleSlice.navItems);
    console.log(page, tag);
    try {
      const response = await axios.get(
        `/articles?tag=${tag}&limit=10&offset=${(page - 1) * 10}`
      );
      return response.data;
    } catch (err) {
      console.log(err);
      return err;
    }
  }
);

export const articleSlice = createSlice({
  name: "articles",
  initialState: initialState,
  reducers: {},
  extraReducers: {
    [fetchFeedArticles.pending]: (state, action) => {
      Object.assign(state, {
        loading: true,
        error: null,
        articles: [],
        articlesCount: 0,
        navItems: ["Your Feed", "Global Feed"],
        activeItem: "Your Feed",
      });
    },
    [fetchFeedArticles.fulfilled]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: null,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        navItems: ["Your Feed", "Global Feed"],
        activeItem: "Your Feed",
      });
    },
    [fetchFeedArticles.rejected]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: action.error,
        articles: [],
        articlesCount: 0,
        navItems: ["Your Feed", "Global Feed"],
        activeItem: "Your Feed",
      });
    },
    [fetchGlobalArticles.pending]: (state, action) => {
      console.log(action);
      Object.assign(state, {
        loading: true,
        error: null,
        articles: [],
        articlesCount: 0,
        navItems: ["Your Feed", "Global Feed"],
        activeItem: "Global Feed",
      });
    },
    [fetchGlobalArticles.fulfilled]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: null,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        navItems: ["Your Feed", "Global Feed"],
        activeItem: "Global Feed",
      });
    },
    [fetchGlobalArticles.rejected]: (state, action) => {
      console.log(action);
      Object.assign(state, {
        loading: false,
        error: action.error,
        articles: [],
        articlesCount: 0,
        navItems: ["Your Feed", "Global Feed"],
        activeItem: "Global Feed",
      });
    },
    [fetchArticlesByTag.pending]: (state, action) => {
      console.log(action);
      Object.assign(state, {
        loading: true,
        error: null,
        articles: [],
        articlesCount: 0,
        navItems: ["Your Feed", "Global Feed"],
        activeItem: "Global Feed",
      });
    },
    [fetchArticlesByTag.fulfilled]: (state, action) => {
      let updateNavItems = state.navItems;

      updateNavItems[2] = action.meta.arg.tag; //Just replace it with new tag

      console.log(action);
      Object.assign(state, {
        loading: false,
        error: null,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        navItems: updateNavItems,
        activeItem: action.meta.arg.tag,
      });
    },
    [fetchArticlesByTag.rejected]: (state, action) => {
      console.log(action);
      Object.assign(state, {
        loading: false,
        error: null,
        articles: [],
        articlesCount: 0,
        navItems: ["Your Feed", "Global Feed"],
        activeItem: "Global Feed",
      });
    },
  },
});

export const getArticles = (state) => {
  return state.articleSlice.articles;
};
export const getArticlesCount = (state) => state.articleSlice.articlesCount;
export const loading = (state) => state.articleSlice.loading;
export const navItems = (state) => state.articleSlice.navItems;
export const activeItem = (state) => state.articleSlice.activeItem;
export default articleSlice.reducer;
