import React from "react";
import { navItems } from "../../features/articles/articleSlice";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { MY_FEED } from "../../constants/TabItem";

function HomeTabs({ getActiveItem, handleNavItemClick, isLoggedIn }) {
  let NavItems = useSelector(navItems);
  NavItems.filter((item) => {
    if (isLoggedIn && item === MY_FEED) {
      return false;
    }
    return true;
  });

  return (
    <TabsContainer>
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
    </TabsContainer>
  );
}

export default HomeTabs;

const TabsContainer = styled.div`
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
