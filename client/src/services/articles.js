import axios from "../config/api.config";

export const getFeedArticles = async ({ page }) => {
  try {
    console.log("page", page);
    const response = await axios.get(
      `/articles/feed?limit=10&offset=${(page - 1) * 10}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    return e;
  }
};

export const getGlobalArticles = async ({ page }) => {
  try {
    const response = await axios.get(
      `/articles?limit=10&offset=${(page - 1) * 10}`
    );
    return response.data;
  } catch (e) {
    console.log(e.response);
    return e;
  }
};

export const getArticleByTag = async ({ page, tag }) => {
  try {
    const response = await axios.get(
      `/articles?tag=${tag}&limit=10&offset=${(page - 1) * 10}`
    );
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const getArticleBySlug = async (slug) => {
  try {
    const res = await axios.get(`/articles/${slug}`);
    return res.data;
  } catch (err) {
    return err.response;
  }
};

export const getCommentsBySlug = async (slug) => {
  try {
    const res = await axios.get(`/articles/${slug}/comments`);
    return res.data;
  } catch (err) {
    return err.response;
  }
};

export const deleteArticle = async (slug) => {
  try {
    const res = await axios.delete(`/articles/${slug}`);
    console.log(res);
    return res;
  } catch (e) {
    return e.response;
  }
};

export const DeleteComment = async (slug, id) => {
  try {
    const res = await axios.delete(`/articles/${slug}/comments/${id}`);
    console.log(res.data);
    return res.data;
  } catch (err) {
    return err.response;
  }
};

export const getFavouritedArticles = async ({ page, username }) => {
  try {
    const res = await axios.get(
      `/articles/?favorited=${username}&limit=10&offset=${(page - 1) * 10}`
    );
    return res.data;
  } catch (e) {
    return e.response;
  }
};

export const isFavourite = async (slug) => {
  try {
    const res = await axios.get(`/articles/${slug}`);
    return res.data;
  } catch (err) {
    return err.response;
  }
};
export const MarkFavourite = async (slug) => {
  console.log(slug);

  try {
    const res = await axios.post(`/articles/${slug}/favorite`);
    return res.data;
  } catch (e) {
    return e.response;
  }
};

export const MarkUnFavourite = async (slug) => {
  try {
    const res = await axios.delete(`/articles/${slug}/favorite`);
    return res.data;
  } catch (e) {
    return e.response;
  }
};

export const getArticlesByUsername = async ({ page, username }) => {
  try {
    const res = await axios.get(
      `/articles/?author=${username}&limit=10&offset=${(page - 1) * 10}`
    );
    console.log(res.data);
    return res.data;
  } catch (e) {
    return e.response;
  }
};

export const postArticle = async ({ title, description, body, tagList }) => {
  try {
    const res = await axios.post("/articles", {
      article: {
        title,
        description,
        body,
        tagList,
      },
    });

    return res.data;
  } catch (err) {
    console.log(err);
    return err.response;
  }
};

export const postComment = async (slug, body) => {
  try {
    const res = await axios.post(`/articles/${slug}/comments`, {
      comment: {
        body,
      },
    });

    return res.data;
  } catch (err) {
    return err.response;
  }
};

export const updateArticle = async (slug, formState) => {
  try {
    const res = await axios.put(`/articles/${slug}`, {
      article: {
        title: formState.title,
        description: formState.description,
        body: formState.body,
        tagList: formState.tagList,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.log(e);
    return e.response;
  }
};
