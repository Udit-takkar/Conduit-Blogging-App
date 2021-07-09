import React from "react";
import { Redirect, Route } from "react-router-dom";
import { store } from "./app/store";

function PrivateRoute({ children, ...rest }) {
  // console.log(store.getState().signup.isLoggedIn);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        store.getState().signup.isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
export default PrivateRoute;
