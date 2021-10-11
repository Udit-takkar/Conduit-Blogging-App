import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { postArticle } from "../services/articles";
import { useHistory } from "react-router-dom";
import { getUsername } from "../features/authentication/authSlice.js";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { updateArticle } from "../services/articles";
import Yamde from "yamde";
import {
  faHeading,
  faParagraph,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function NewPost() {
  const username = useSelector(getUsername);
  const location = useLocation();
  const history = useHistory();
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    body: "",
    tagList: [],
  });
  const [tags, setTags] = useState("");
  const [err, setErr] = useState([]);
  useEffect(() => {
    if (location.state !== undefined) {
      setFormState({
        title: location.state.title,
        description: location.state.description,
        body: location.state.body,
        tagList: location.state.tagList,
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleEditor = (e) => {
    setFormState({ ...formState, body: e });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check If We have to update the article

    if (location.state !== undefined) {
      const res = await updateArticle(location.state.slug, formState);
      history.push(`/articles/${res.article.slug}`);
    } else {
      const res = await postArticle(formState);
      if (res.article !== undefined) {
        history.push(`/profile/${username}`);
      } else {
        setErr(res.data.errors);
      }
    }
  };
  const handleTags = (e) => {
    setTags(e.target.value);
    const tagsList = tags.split(" ");
    setFormState({ ...formState, tagList: tagsList });
  };

  return (
    <NewPostContainer>
      {err !== []
        ? Object.entries(err).map(([key, value]) => {
            return (
              <Error>
                <span className="key">{key}</span> : {value}
                <br />
              </Error>
            );
          })
        : null}

      <InputBox>
        <FontAwesomeIcon icon={faHeading} />
        <input
          onChange={handleChange}
          value={formState.title}
          placeholder="Article Title"
          name="title"
          id="input"
        />
      </InputBox>
      <InputBox>
        <FontAwesomeIcon icon={faParagraph} />
        <input
          onChange={handleChange}
          value={formState.description}
          placeholder="What's this article about"
          name="description"
        />
      </InputBox>
      <Editor>
        <Yamde
          name="body"
          value={formState.body}
          handler={handleEditor}
          theme="light"
        />
      </Editor>
      <InputBox>
        <FontAwesomeIcon icon={faHashtag} />
        <input
          onChange={handleTags}
          value={tags}
          placeholder="Enter Tags"
          name="tags"
        />
      </InputBox>

      <button onClick={handleSubmit}>
        {location.state !== undefined ? (
          <span>Update Article</span>
        ) : (
          <span>Publish Article</span>
        )}
      </button>
    </NewPostContainer>
  );
}

const NewPostContainer = styled.div`
  display: flex;
  flex-direction: column;
  place-items: center;
  margin-top: 3rem;
  width:100%;

  > button {
    display: inline-block;
    padding: 1rem 1.75rem;
    font-size: 1.25rem;
    border-radius: 0.3rem;
    color: #fff;
    background-color: #5cb85c;
    border-color: #5cb85c;
    border: none;
    margin-top: 15px;
    cursor: pointer;
    width: 100%;
    max-width: 700px;
    margin-bottom:30px
  }
  }
`;

const InputBox = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.3rem;
  padding-left: 20px;
  margin-top: 10px;
  max-width: 700px;
  width: 100%;
  > input {
    padding: 1.25rem 1.5rem;
    border: none;
    width: 100%;
    ::placeholder {
      color: rgba(0, 0, 0, 0.55);
      font-family: "poppins";
    }
    font-family: "poppins";
    :focus {
      outline: none;
    }
  }
`;

const Error = styled.div`
  color: #ff0033;
  font-weight: 500;
  > span {
    text-transform: uppercase;
  }
`;

const Editor = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 700px;
  height: 350px;
  margin-bottom: 30px;
`;

export default NewPost;
