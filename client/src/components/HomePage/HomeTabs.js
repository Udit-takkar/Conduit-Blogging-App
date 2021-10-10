import React from "react";
import { navItems } from "../../features/articles/articleSlice";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { MY_FEED } from "../../constants/TabItem";

function HomeTabs({ getActiveItem, handleNavItemClick, isLoggedIn }) {
  const NavItems = useSelector(navItems);
  return (
    <TabsContainer>
      {NavItems.map((item) => {
        if (isLoggedIn || (!isLoggedIn && item !== MY_FEED)) {
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
        } else {
          return null;
        }
      })}
    </TabsContainer>
  );
}

export default HomeTabs;

const TabsContainer = styled.div`
  display: flex;
  margin-top: 2rem;
  width: 100%;
  max-width: 60vw;
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
