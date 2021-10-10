import React, { useEffect, useState } from "react";
import uuid from "react-uuid";
import styled from "styled-components";
import { fetchArticlesByTag } from "../features/articles/articleSlice";
import { useDispatch } from "react-redux";
import { getTags } from "../services/tags";
import { useHistory } from "react-router-dom";
require("dotenv").config();

function Tags() {
  const history = useHistory();
  const [tags, setTags] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await getTags();
        setTags(res.tags);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    setLoading(true);
    fetchTags();
  }, []);
  return (
    <TagContainer>
      <p>Popular Tags</p>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        tags.map((tag) => {
          return (
            <TagsList
              onClick={() => {
                dispatch(fetchArticlesByTag({ page: 1, tag }));
                history.push(`/tag/${tag.trim()}?page=1`);
              }}
              key={uuid()}
            >
              {tag}
            </TagsList>
          );
        })
      )}
    </TagContainer>
  );
}
const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  display: inline-block;
  color: rgba(117, 117, 117, 1) !important;
  font-size: 0.7em;
  padding: 0.6em;
  border: 1px solid rgba(230, 230, 230, 1);
  white-space: nowrap;
  margin-right: 3px;
  margin-bottom: 0.5rem;

  cursor: pointer;
  > p {
    text-align: center;
  }
`;
const TagContainer = styled.div`
  max-width: 200px;
  padding: 0.5rem;
  margin-top: 1.5rem;
  max-height: fit-content !important;
`;

export default Tags;
