import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getFavouritedArticles,
  getArticlesByUsername,
  getFeedArticles,
  getGlobalArticles,
  getArticleByTag,
} from "../../services/articles";
import { GLOBAL_FEED, MY_FEED } from "../../constants/TabItem";

const initialState = {
  loading: false,
  error: null,
  articles: [],
  articlesCount: 0,
  navItems: [GLOBAL_FEED, MY_FEED],
  activeItem: GLOBAL_FEED,
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
        activeItem: MY_FEED,
      });
    },
    [fetchFeedArticles.fulfilled]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: null,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        navItems: state.navItems.slice(0, 2),
        activeItem: MY_FEED,
      });
    },
    [fetchFeedArticles.rejected]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: action.error,
        articles: [],
        articlesCount: 0,
        navItems: state.navItems.slice(0, 2),
        activeItem: MY_FEED,
      });
    },
    [fetchGlobalArticles.pending]: (state, action) => {
      Object.assign(state, {
        loading: true,
        error: null,
        articles: [],
        articlesCount: 0,
        navItems: state.navItems.slice(0, 2),
        activeItem: GLOBAL_FEED,
      });
    },
    [fetchGlobalArticles.fulfilled]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: null,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
        navItems: state.navItems.slice(0, 2),
        activeItem: GLOBAL_FEED,
      });
    },
    [fetchGlobalArticles.rejected]: (state, action) => {
      Object.assign(state, {
        loading: false,
        error: action.error,
        articles: [],
        articlesCount: 0,
        navItems: state.navItems.slice(0, 2),
        activeItem: GLOBAL_FEED,
      });
    },
    [fetchArticlesByTag.pending]: (state, action) => {
      Object.assign(state, {
        loading: true,
        error: null,
        articles: [],
        articlesCount: 0,
        navItems: state.navItems.slice(0, 2),
        activeItem: GLOBAL_FEED,
      });
    },
    [fetchArticlesByTag.fulfilled]: (state, action) => {
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
        activeItem: GLOBAL_FEED,
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
