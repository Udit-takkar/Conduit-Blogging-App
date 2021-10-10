import React from "react";
import styled from "styled-components";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUsername } from "../../features/authentication/authSlice.js";
import { useSelector } from "react-redux";

function CommentCard({ username, image, body, createdAt, id, deleteComment }) {
  const loggedInUsername = useSelector(getUsername);
  return (
    <Card>
      <TextBox>{body}</TextBox>
      <UserBox>
        <div>
          <img src={image} alt="avatar" />
          <h3>{username}</h3>
          <h3>{createdAt}</h3>
        </div>

        {loggedInUsername === username ? (
          <button onClick={() => deleteComment(id)}>
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        ) : null}
      </UserBox>
    </Card>
  );
}
const Card = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 35em;
`;
const TextBox = styled.div`
  padding: 20px;
  height: 30em;
  max-height: 120px;
  border: 1px solid #e5e5e5;
`;

const UserBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e5e5e5;
  box-shadow: none !important;
  font-size: 0.7rem;
  font-weight: 300;
  padding: 0.75em 1.35em;
  background-color: #f5f5f5;
  min-width: 40%;
  max-height: 5%;
  box-shadow: none !important;
  > div {
    display: flex;
    align-items: center;
    > h3 {
      font-size: 1.25em;
      margin-bottom: 0;
      margin-left: 5px;
    }
    > img {
      height: 20px;
      width: 20px;
      border-radius: 30px;
    }
  }
  > button {
    cursor: pointer;
  }
`;
export default CommentCard;
