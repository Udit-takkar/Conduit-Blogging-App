import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getFavouritedArticles,
  getArticlesByUsername,
  getFeedArticles,
  getGlobalArticles,
  getArticleByTag,
} from "../../services/articles";

const initialState = {
  loading: false,
  error: null,
  articles: [],
  articlesCount: 0,
  navItems: ["Global Feed", "Your Feed"],
  activeItem: "Global Feed",
};

export const fetchFeedArticles = createAsyncThunk(
  "articles/feed",
  getFeedArticles
);

export const fetchGlobalArticles = createAsyncThunk(
  "articles/global",
  getGlobalArticles
);

export const fetchArticlesByTag = createAsyncThunk(
  "articles/tag",
  getArticleByTag
);

export const fetchUserFavoritedArticle = createAsyncThunk(
  "articles/favorited",
  getFavouritedArticles
);

export const fetchArticleByUsername = createAsyncThunk(
  "articles/my",
  getArticlesByUsername
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
        navItems: state.navItems.slice(0, 2),
        activeItem: "Your Feed",
      });
    },
    [fetchFeedArticles.fulfilled]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: null,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        navItems: state.navItems.slice(0, 2),
        activeItem: "Your Feed",
      });
    },
    [fetchFeedArticles.rejected]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: action.error,
        articles: [],
        articlesCount: 0,
        navItems: state.navItems.slice(0, 2),
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
        navItems: state.navItems.slice(0, 2),
        activeItem: "Global Feed",
      });
    },
    [fetchGlobalArticles.fulfilled]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: null,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        navItems: state.navItems.slice(0, 2),
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
        navItems: state.navItems.slice(0, 2),
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
        navItems: state.navItems.slice(0, 2),
        activeItem: "Global Feed",
      });
    },
    [fetchArticlesByTag.fulfilled]: (state, action) => {
      console.log(action);
      Object.assign(state, {
        loading: false,
        error: null,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        navItems: [...state.navItems.slice(0, 2), action.meta.arg.tag],
        activeItem: action.meta.arg.tag,
      });
    },
    [fetchArticlesByTag.rejected]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: null,
        articles: [],
        articlesCount: 0,
        navItems: state.navItems,
        activeItem: "Global Feed",
      });
    },
    [fetchUserFavoritedArticle.pending]: (state, action) => {
      Object.assign(state, {
        loading: true,
        error: null,
        articles: [],
        articlesCount: 0,
        navItems: state.navItems,
        activeItem: state.activeItem,
      });
    },
    [fetchUserFavoritedArticle.fulfilled]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: null,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        navItems: state.navItems,
        activeItem: state.activeItem,
      });
    },
    [fetchUserFavoritedArticle.rejected]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: null,
        articles: [],
        articlesCount: 0,
        navItems: state.navItems,
        activeItem: state.activeItem,
      });
    },
    [fetchArticleByUsername.pending]: (state, action) => {
      Object.assign(state, {
        loading: true,
        error: null,
        articles: [],
        articlesCount: 0,
        navItems: state.navItems,
        activeItem: state.activeItem,
      });
    },
    [fetchArticleByUsername.fulfilled]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: null,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        navItems: state.navItems,
        activeItem: state.activeItem,
      });
    },
    [fetchArticleByUsername.rejected]: (state, action) => {
      console.log(action);
      Object.assign(state, {
        loading: false,
        error: null,
        articles: [],
        articlesCount: 0,
        navItems: state.navItems,
        activeItem: state.activeItem,
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
