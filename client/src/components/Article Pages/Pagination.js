import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

function Pagination({ articlesCount, activePage, tabName }) {
  const history = useHistory();
  const activePageNumber = activePage ?? 1;
  const NumberOfPages = [];

  for (let i = 1; i <= Math.ceil(articlesCount / 10); ++i) {
    NumberOfPages.push(i);
  }
  const handlePages = async (page) => {
    history.push({
      search: `?page=${page}`,
    });
  };
  return (
    <PageContainer>
      {NumberOfPages.map((page) => {
        return (
          <PagesBox
            key={page}
            onClick={() => handlePages(page)}
            style={{
              backgroundColor:
                parseInt(activePageNumber) === page ? "#5cb85c" : "white",
              color: parseInt(activePageNumber) === page ? "white" : "black",
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
