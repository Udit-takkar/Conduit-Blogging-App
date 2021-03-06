import React, { useEffect } from "react";
import styled from "styled-components";
import ArticleCard from "../Article Pages/ArticleCard";
import {
  getArticles,
  getArticlesCount,
  loading,
} from "../../features/articles/articleSlice";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../Article Pages/Pagination";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useHistory, useParams } from "react-router-dom";
import HomeTabs from "./HomeTabs";
import { GLOBAL_FEED, MY_FEED } from "../../constants/TabItem";

function App({ isLoggedIn, activeItem, getPageArticles }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const { search } = useLocation();
  const { tagname } = useParams();

  const { page } = queryString.parse(search);

  const isLoading = useSelector(loading);

  const articles = useSelector(getArticles);
  const articlesCount = useSelector(getArticlesCount);

  useEffect(() => {
    const getArticles = async () => {
      await dispatch(
        getPageArticles({ page: page ?? 1, tag: tagname ?? null })
      );
    };
    getArticles();
  }, [page, tagname]);

  const handleNavItemClick = async (item) => {
    if (item === GLOBAL_FEED) {
      history.push("/globalfeed");
    } else if (item === MY_FEED) {
      history.push("/myfeed");
    }
  };

  return (
    <HomePageContainer>
      <HomeTabs
        getActiveItem={activeItem}
        handleNavItemClick={handleNavItemClick}
        isLoggedIn={isLoggedIn}
      />
      <AppContainer>
        <ArticlesContainer>
          {isLoading === true ? (
            <Loader
              type="TailSpin"
              color="#5cb85c"
              height={80}
              width={80}
              style={{ marginTop: "50px" }}
            />
          ) : null}
          {!isLoading && articlesCount === 0 ? (
            <p>No articles are here... yet.</p>
          ) : (
            <>
              {articles?.map((article) => {
                const {
                  author: { username, image },
                  title,
                  description,
                  favoritesCount,
                  createdAt,
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
                    favoritesCount={favoritesCount}
                    slug={article.slug}
                    favorited={favorited}
                  />
                );
              })}
            </>
          )}
        </ArticlesContainer>
        <Pagination articlesCount={articlesCount} activePage={page} />
      </AppContainer>
    </HomePageContainer>
  );
}

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 75px;
`;
const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ArticlesContainer = styled.div`
  > p {
    margin-top: 130px;
  }
`;
export default App;
