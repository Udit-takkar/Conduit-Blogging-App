import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { isUserLoggedIn, getUsername } from "../features/authentication/signup";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";

function Header() {
  const history = useHistory();
  const isLoggedIn = useSelector(isUserLoggedIn);
  const username = useSelector(getUsername);
  const goToHome = () => {
    history.push("/global/?page=1");
  };
  return (
    <HeaderContainer>
      <h2 onClick={goToHome}>conduit</h2>
      <HeaderLinks>
        <Link to="/global/?page=1" style={linkStyle}>
          Home
        </Link>

        {isLoggedIn ? (
          <>
            <Link to="/newpost" style={linkStyle}>
              <FontAwesomeIcon icon={faPlusSquare} /> New Post
            </Link>
            <Link to="/settings" style={linkStyle}>
              <FontAwesomeIcon icon={faCog} /> Settings
            </Link>
            <Link to={`/profile/${username}`} style={linkStyle}>
              {username}
            </Link>
          </>
        ) : (
          <>
            <Link to="/signin" style={linkStyle}>
              Sign In
            </Link>
            <Link to="/signup" style={linkStyle}>
              Sign Up
            </Link>
          </>
        )}
      </HeaderLinks>
    </HeaderContainer>
  );
}
const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  min-height: 70px;
  min-width: 100vw;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8px 6px -6px #999;
  background-color: white;
  z-index: 2;
  > h2 {
    padding-left: 3rem;
    color: #5cb85c;
    cursor: pointer;
  }
`;
const HeaderLinks = styled.div`
  display: flex;
  padding-right: 30px;

  > Link {
    padding-right: 10px;
  }
`;
const linkStyle = {
  paddingRight: "20px",
  textDecoration: "none",
  color: "rgba(0,0,0,.3)",
};
export default Header;
