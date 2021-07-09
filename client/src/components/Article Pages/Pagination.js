import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { navItems } from "../../features/articles/articleSlice";
import { fetchArticlesByTag } from "../../features/articles/articleSlice";
import { useHistory } from "react-router-dom";

function Pagination({
  articlesCount,
  activePage,

  tabName,
}) {
  const [isActive, setIsActive] = useState(activePage);
  console.log(isActive);
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    setIsActive(activePage);
  }, [tabName, activePage]);
  const tabs = useSelector(navItems);
  const NumberOfPages = [];

  for (let i = 1; i <= Math.ceil(articlesCount / 10); ++i) {
    NumberOfPages.push(i);
  }
  const handlePages = async (page) => {
    history.push({
      search: `?page=${page}`,
    });

    // if (Component === "Home") {
    //   if (tabName === "Global Feed" || tabName === "Your Feed") {
    //     await dispatch(getPageArticles(page));
    //   } else {
    //     await dispatch(fetchArticlesByTag({ page, tag: tabName }));
    //   }
    // } else {
    //   await getPageArticles(page);
    // }
  };
  return (
    <PageContainer>
      {NumberOfPages.map((page) => {
        return (
          <PagesBox
            key={page}
            onClick={() => handlePages(page)}
            style={{
              backgroundColor: isActive == page ? "#5cb85c" : "white",
              color: isActive == page ? "white" : "black",
            }}
          >
            {page}
          </PagesBox>
        );
      })}
    </PageContainer>
  );
}
const PageContainer = styled.div`
  max-width: 70vw;
  margin-left: 40px;
`;
const PagesBox = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  margin-left: 0;
  border-bottom-left-radius: 0.25rem;
  border-top-left-radius: 0.25rem;
  border: 1px solid #ddd;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
`;

export default Pagination;
