import React from "react";
import { Switch, Route } from "react-router-dom";
import SignIn from "./components/Auth Pages/SignIn";
import CoreLayout from "./layouts/CoreLayout";
import SignUp from "./components/Auth Pages/SignUp";
import Settings from "./components/Settings Page/Settings";
import NewPost from "./components/NewPost";
import Profile from "./components/Profile Page/Profile";
import ArticleDisplay from "./components/Article Pages/ArticleDisplay";
import PrivateRoute from "./PrivateRoute";
import Header from "./components/Header";

function Routes() {
  return (
    <>
      <Header />
      <Switch>
        <Route exact path="/signin">
          <SignIn />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <PrivateRoute path="/settings">
          <Settings />
        </PrivateRoute>
        <PrivateRoute exact path="/newpost">
          <NewPost />
        </PrivateRoute>
        <Route exact path="/profile/:username">
          <Profile />
        </Route>
        <Route exact path="/articles/:slug">
          <ArticleDisplay />
        </Route>
        <Route path="/">
          <CoreLayout />
        </Route>
      </Switch>
    </>
  );
}

export default Routes;
