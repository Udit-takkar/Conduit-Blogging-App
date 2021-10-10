import React from "react";
import styled from "styled-components";
import Banner from "../components/Banners/Banner";
import Tags from "../components/Tags";
import Home from "../components/HomePage";
import { isUserLoggedIn } from "../features/authentication/authSlice.js";
import { useSelector } from "react-redux";
import { Route } from "react-router-dom";
import {
  activeItem,
  fetchFeedArticles,
  fetchGlobalArticles,
  fetchArticlesByTag,
} from "../features/articles/articleSlice";

function HomePageLayout({ children }) {
  const isLoggedIn = useSelector(isUserLoggedIn);
  const getActiveItem = useSelector(activeItem);

  return (
    <MainContainer>
      {isLoggedIn === false && <Banner />}
      <FeedAndTagContainer>
        <>
          <Route
            exact
            path="/globalfeed"
            render={(props) => (
              <Home
                {...props}
                activeItem={getActiveItem}
                isLoggedIn={isLoggedIn}
                getPageArticles={fetchGlobalArticles}
              />
            )}
          />
          <Route
            exact
            path="/myfeed"
            render={(props) => (
              <Home
                {...props}
                activeItem={getActiveItem}
                isLoggedIn={isLoggedIn}
                getPageArticles={fetchFeedArticles}
              />
            )}
          />
          <Route
            exact
            path="/tag/:tagname"
            render={(props) => (
              <Home
                {...props}
                activeItem={getActiveItem}
                isLoggedIn={isLoggedIn}
                getPageArticles={fetchArticlesByTag}
              />
            )}
          />
        </>
        <Tags />
      </FeedAndTagContainer>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const FeedAndTagContainer = styled.div`
  display: flex;
  > div {
    flex: 0.75;
    width: 100%;
  }
  > Tags {
    flex: 0.25;
    height: 220px;
  }
`;
export default HomePageLayout;
