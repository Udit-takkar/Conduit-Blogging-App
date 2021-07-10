import React, { useState } from "react";
import styled from "styled-components";
import {
  getUsername,
  getUserEmail,
  getUserImg,
  getUserBio,
  update,
  error,
} from "../../features/authentication/signup";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../../ApiEndpoints/user";
import { useHistory } from "react-router-dom";
import { logoutUser } from "../../features/authentication/signup";
import {
  faLink,
  faUser,
  faEnvelopeSquare,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { API_DELETE_LOGOUT } from "../../constants/api";

function Settings() {
  const dispatch = useDispatch();
  const history = useHistory();
  const username = useSelector(getUsername);
  const userEmail = useSelector(getUserEmail);
  const userImg = useSelector(getUserImg) || "";
  const userBio = useSelector(getUserBio);
  const checkError = useSelector(error);
  const [updateForm, setUpdateForm] = useState({
    image: userImg,
    username: username,
    bio: userBio,
    email: userEmail,
    password: "",
  });
  console.log(userBio);
  console.log(updateForm);
  const handleChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //add validation here
    const check = await dispatch(update(updateForm));
    console.log(check);
    if (!checkError) {
      console.log(checkError);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await dispatch(logoutUser());
      localStorage.removeItem("user");
      const res = await axios.delete(API_DELETE_LOGOUT);
      history.push("/");
    } catch (err) {
      if (err.response.status === 403 || err.response.status === 401) {
        window.location.href = "/signin";
      }
    }
  };
  return (
    <>
      <SettingsContainer>
        <h3>Your Settings</h3>
        <InputBox>
          <FontAwesomeIcon icon={faLink} />
          <input
            onChange={handleChange}
            name="image"
            type="url"
            placeholder="URL of profile picture"
            value={updateForm.image}
          />
        </InputBox>
        <InputBox>
          <FontAwesomeIcon icon={faUser} />
          <input
            onChange={handleChange}
            name="username"
            placeholder="username"
            value={updateForm.username}
          />
        </InputBox>
        <textarea
          onChange={handleChange}
          name="bio"
          type="text"
          placeholder="Short bio about you"
          value={updateForm.bio}
        />

        <InputBox>
          <FontAwesomeIcon icon={faEnvelopeSquare} />
          <input
            onChange={handleChange}
            name="email"
            placeholder="email"
            value={updateForm.email}
            type="email"
          />
        </InputBox>
        <InputBox>
          <FontAwesomeIcon icon={faKey} />

          <input
            onChange={handleChange}
            name="password"
            placeholder="new password"
            type="password"
          />
        </InputBox>

        <ButtonContainer>
          <button style={logoutBtn} onClick={handleLogout} type="submit">
            Logout
          </button>

          <button onClick={handleSubmit} type="submit">
            Update Settings
          </button>
        </ButtonContainer>
      </SettingsContainer>
    </>
  );
}

const InputBox = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
  border-radius: 0.3rem;
  border: 1px solid rgba(0, 0, 0, 0.15);
  padding-left: 20px;
  margin-top: 10px;
  > input {
    padding: 0.75rem 1.5rem;
    border: none;
    margin-top: 10px;
    min-width: 40vw;
    font-family: "poppins";
    :focus {
      outline: none;
    }
  }
`;

const SettingsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  // max-width: fit-content;
  margin-top: 30px;
  > h3 {
    font-size: 30px;
    font-weight: 700;
  }
  > textarea {
    padding: 0.75rem 1.5rem;
    border-radius: 0.3rem;
    border: 1px solid rgba(0, 0, 0, 0.15);
    margin-top: 10px;
    min-width: 42vw;
    min-height: 20vh;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  // place-items: center;
  align-items: center;
  justify-content: space-around;
  // min-width: 60vw;

  > button {
    border: none;
    margin-top: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1.25rem;
    border-radius: 0.3rem;
    color: #fff;
    background-color: #5cb85c;
    border-color: #5cb85c;
    cursor: pointer;
    margin-left: 30px;
  }
`;
const logoutBtn = {
  border: "1px solid transparent",
  padding: "0.75rem 1.5rem",
  fontSize: " 1.25rem",
  borderRadius: "0.3rem",
  // color: #fff;
  color: "#b85c5c",
  backgroundImage: "none",
  backgroundColor: "transparent",
  borderColor: "#b85c5c",
  cursor: "pointer",
};
export default Settings;
