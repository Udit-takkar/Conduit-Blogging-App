import React from "react";
import { Redirect, Route } from "react-router-dom";
import { store } from "./app/store";

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        store.getState().authSlice.isLoggedIn ? (
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
