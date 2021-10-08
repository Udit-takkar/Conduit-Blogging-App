import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import SignIn from "./components/Auth Pages/SignIn";
import HomePageLayout from "./layouts/HomePageLayout";
import SignUp from "./components/Auth Pages/SignUp";
import Settings from "./components/Settings Page/Settings";
import NewPost from "./components/NewPost";
import Profile from "./components/Profile Page/Profile";
import ArticleDisplay from "./components/Article Pages/ArticleDisplay";
import PrivateRoute from "./PrivateRoute";
import NavBar from "./components/NavBar";

function Routes() {
  return (
    <>
      <NavBar />
      <Switch>
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/signup" component={SignUp} />
        <PrivateRoute path="/settings">
          <Settings />
        </PrivateRoute>
        <PrivateRoute exact path="/newpost">
          <NewPost />
        </PrivateRoute>
        <Route exact path="/profile/:username">
          <Profile />
        </Route>
        <Route exact path="/articles/:slug" component={ArticleDisplay} />
        <Route exact path="/">
          <Redirect to="/globalfeed" />
        </Route>
        <Route component={HomePageLayout} />
      </Switch>
    </>
  );
}

export default Routes;
