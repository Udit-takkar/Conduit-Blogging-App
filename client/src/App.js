import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import ArticleCard from "./components/Article Pages/ArticleCard";
import { NavLink } from "react-router-dom";
import {
  fetchFeedArticles,
  fetchGlobalArticles,
  getArticles,
  navItems,
  getArticlesCount,
  loading,
  activeItem,
  fetchArticlesByTag,
} from "./features/articles/articleSlice";
import { useDispatch, useSelector } from "react-redux";
import uuid from "react-uuid";
import { isUserLoggedIn } from "./features/authentication/signup";
import Pagination from "./components/Article Pages/Pagination";
import Skeleton from "react-loading-skeleton";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { useLocation, useParams } from "react-router-dom";
import queryString from "query-string";
import { useHistory } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { search } = useLocation();
  const { pathname } = useLocation();

  let { page } = queryString.parse(search);
  if (page === undefined) page = 1;

  const isLoggedIn = useSelector(isUserLoggedIn);
  const getActiveItem = useSelector(activeItem);
  const isLoading = useSelector(loading);

  const articles = useSelector(getArticles);
  const articlesCount = useSelector(getArticlesCount);

  const [activeTab, setActiveTab] = useState({
    getPageArticles: fetchGlobalArticles,
  });

  let NavItems = useSelector(navItems);
  // Checks which tab to show depending if user has logged in or not
  const checkNav = (NavItem) => {
    if (isLoggedIn === false && NavItem === "Your Feed") {
      return false;
    } else return true;
  };

  NavItems = NavItems.filter(checkNav);

  useEffect(() => {
    const getFeedArticles = async () => {
      await dispatch(activeTab.getPageArticles(page));
    };
    const getFeedArticlesByTag = async () => {
      await dispatch(fetchArticlesByTag({ page, tag: pathname.slice(1, -1) }));
    };
    if (pathname === "/global/" || pathname === "/myfeed/") {
      getFeedArticles();
    } else if (pathname !== "undefined" && pathname) {
      getFeedArticlesByTag();
    }
  }, [page, pathname]);

  useEffect(() => {
    //Just for intial page load
    history.push("/global/?page=1");
  }, []);

  const handleNavItemClick = async (item) => {
    if (item === "Global Feed") {
      setActiveTab({
        getPageArticles: fetchGlobalArticles,
      });
      history.push("/global/?page=1");
    } else if (item === "Your Feed") {
      setActiveTab({
        getPageArticles: fetchFeedArticles,
      });
      history.push("/myfeed/?page=1");
    }
  };

  return (
    <>
      <NavBar>
        {NavItems.map((item) => {
          return (
            <button
              className={getActiveItem === item ? "active" : null}
              key={item}
              onClick={() => {
                handleNavItemClick(item);
              }}
            >
              {item}
            </button>
          );
        })}
      </NavBar>
      <AppContainer>
        <ArticlesContainer>
          {/* {console.count()} */}
          {articlesCount === 0 ? (
            <>
              {isLoading === true ? (
                <Loader
                  type="TailSpin"
                  color="#5cb85c"
                  height={80}
                  width={80}
                  style={{ marginTop: "50px" }}
                />
              ) : (
                <p>No articles are here... yet.</p>
              )}
            </>
          ) : (
            <>
              {articles.map((article) => {
                const {
                  author: { username, image },
                  title,
                  description,
                  favoritesCount,
                  createdAt,
                } = article;

                return (
                  <ArticleCard
                    key={article.slug}
                    username={username}
                    image={image}
                    title={title}
                    description={description}
                    createdAt={createdAt}
                    favoritesCount={favoritesCount}
                    slug={article.slug}
                  />
                );
              })}
            </>
          )}
        </ArticlesContainer>
        <Pagination
          articlesCount={articlesCount}
          getPageArticles={activeTab.getPageArticles}
          tabName={getActiveItem}
          Component="Home"
          activePage={page}
          activeItem={activeItem}
        />
      </AppContainer>
    </>
  );
}
const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const NavBar = styled.div`
  display: flex;
  margin-top: 2rem;
  margin-left: 5rem;
  > button {
    display: inline-block;
    border: none;
    outline: none;
    background-color: white;
    // border-bottom: 1px solid black;
    margin-right: 5px;
    cursor: pointer;
    color: #aaa;
  }
  .active {
    border-bottom: 1px solid green;
    color: green;
  }
`;
const ArticlesContainer = styled.div`
  > p {
    margin-top: 130px;
  }
`;
export default App;
