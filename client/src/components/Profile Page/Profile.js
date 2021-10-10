import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProfileBanner from "../Banners/ProfileBanner";
import ArticleCard from "../Article Pages/ArticleCard";
import { getUsername } from "../../features/authentication/authSlice.js";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useParams, useHistory } from "react-router-dom";
import Pagination from "../Article Pages/Pagination";
import Loader from "react-loader-spinner";
import queryString from "query-string";
import {
  getArticles,
  getArticlesCount,
  loading,
  fetchArticleByUsername,
  fetchUserFavoritedArticle,
} from "../../features/articles/articleSlice";

function Profile() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const history = useHistory();
  const { page } = queryString.parse(search);

  const isLoading = useSelector(loading);
  const articles = useSelector(getArticles);
  const articlesCount = useSelector(getArticlesCount);
  const LoggedInUsername = useSelector(getUsername);

  const [activeTab, setActiveTab] = useState({
    tabName: `${
      LoggedInUsername === username ? "My Articles" : `${username} Articles`
    }`,
    getArticles: fetchArticleByUsername,
  });

  useEffect(() => {
    const loadInitialArticles = async () => {
      await dispatch(activeTab.getArticles({ page: page ?? 1, username }));
    };
    loadInitialArticles();
  }, [page, activeTab.tabName]);

  return (
    <ProfilePageContainer>
      <ProfileBanner username={username} LoggedInUsername={LoggedInUsername} />
      <ProfileArticles>
        <NavBar>
          <button
            className={activeTab.tabName === "My Articles" ? "active" : null}
            onClick={() => {
              setActiveTab({
                tabName: `${
                  LoggedInUsername === username
                    ? "My Articles"
                    : `${username} Articles`
                }`,
                getArticles: fetchArticleByUsername,
              });
              history.push({
                search: `?page=${page}`,
              });
            }}
          >
            {LoggedInUsername === username ? (
              <p>My Articles</p>
            ) : (
              <p>{username} Articles</p>
            )}
          </button>
          <button
            className={activeTab.tabName === "My Articles" ? null : "active"}
            onClick={() => {
              setActiveTab({
                tabName: "Favourite Articles",
                getArticles: fetchUserFavoritedArticle,
              });
              history.push({
                search: `?page=${page}`,
              });
            }}
          >
            <p> Favourite Articles</p>
          </button>
        </NavBar>
        <ArticlesContainer>
          {isLoading === true && (
            <Loader
              type="TailSpin"
              color="#5cb85c"
              height={80}
              width={80}
              style={{ marginTop: "50px" }}
            />
          )}
          {!isLoading && (
            <>
              {articlesCount === 0 && <p>No articles are here... yet.</p>}
              {articles.map((article) => {
                const {
                  author: { username, image },
                  title,
                  description,
                  createdAt,
                  favoritesCount,
                  favorited,
                } = article;

                return (
                  <ArticleCard
                    key={article.slug}
                    username={username}
                    image={image}
                    title={title}
                    description={description}
                    createdAt={createdAt}
                    slug={article.slug}
                    favoritesCount={favoritesCount}
                    favorited={favorited}
                  />
                );
              })}
            </>
          )}
        </ArticlesContainer>
        <Pagination
          articlesCount={articlesCount}
          tabName={activeTab.tabName}
          activePage={page}
        />
      </ProfileArticles>
    </ProfilePageContainer>
  );
}

const ProfilePageContainer = styled.div`
  margin-bottom: 50px;
`;

const ProfileArticles = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
`;
const NavBar = styled.div`
  display: flex;
  align-items: center;
  margin-top: 2em;
  margin-left: 20%;
  align-self: flex-start;
  color: #aaa;
  > button {
    display: inline-block;
    border: none;
    outline: none;
    background-color: white;
    margin-right: 5px;
    cursor: pointer;
    color: #aaa;
  }
  .active {
    border-bottom: 1px solid green;
    color: green;
  }
`;
const ArticlesContainer = styled.div``;
export default Profile;
