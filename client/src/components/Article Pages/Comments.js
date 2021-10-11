import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getCommentsBySlug } from "../../services/articles";
import CommentCard from "./CommentCard";
import { DeleteComment } from "../../services/articles";

function Comments({ slug, Loading }) {
  const [comments, setComments] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteComment = async (id) => {
    setDeleting(true);
    const res = await DeleteComment(slug, id);
    if (res) {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      const data = await getCommentsBySlug(slug);
      setComments(data.comments);
    };
    fetchComments();
  }, [Loading, deleting]);

  return (
    <CommentContainer>
      {comments.map((comment) => {
        const {
          author: { username, image },
          body,
          id,
          createdAt,
        } = comment;
        return (
          <CommentCard
            key={id}
            username={username}
            image={image}
            createdAt={createdAt}
            body={body}
            id={id}
            deleteComment={handleDeleteComment}
          />
        );
      })}
    </CommentContainer>
  );
}

const CommentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
export default Comments;
