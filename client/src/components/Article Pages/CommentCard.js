import React from "react";
import styled from "styled-components";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUsername } from "../../features/authentication/signup";
import { useSelector } from "react-redux";

function CommentCard({ username, image, body, createdAt, id, deleteComment }) {
  const loggedInUsername = useSelector(getUsername);
  return (
    <Card>
      <TextBox>{body}</TextBox>
      <UserBox>
        <div>
          <img src={image} alt="avatar" />
          <p>{username}</p>
          <p style={{ marginLeft: "20px" }}>{createdAt}</p>
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
`;
const TextBox = styled.div`
  padding: 20px;
  min-width: 40vw;
  min-height: 15vh;
  border: 1px solid #e5e5e5;
`;
const UserBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e5e5e5;
  box-shadow: none !important;
  font-size: 0.8rem;
  font-weight: 300;
  padding: 0.75rem 1.35rem;
  background-color: #f5f5f5;
  min-width: 46vw;
  max-height: 2vh;
  box-shadow: none !important;
  > div {
    display: flex;
    align-items: center;
    > img {
      height: 20px;
      width: 20px;
      border-radius: 30px;
    }
    > p {
      margin-left: 5px;
    }
  }
  > button {
    cursor: pointer;
  }
`;
export default CommentCard;
