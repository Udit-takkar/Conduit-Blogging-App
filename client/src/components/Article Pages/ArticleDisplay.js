import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { getArticleBySlug } from "../../services/articles";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Comments from "./Comments";
import {
  isUserLoggedIn,
  getUsername,
} from "../../features/authentication/authSlice.js";
import { useSelector } from "react-redux";
import { deleteArticle } from "../../services/articles";
import { useHistory } from "react-router-dom";
import { postComment } from "../../services/articles";
import Loader from "react-loader-spinner";
import ReactMarkdown from "react-markdown";

function ArticleDisplay() {
  const history = useHistory();
  const isLoggedIn = useSelector(isUserLoggedIn);
  const username = useSelector(getUsername);
  const [isLoading, setLoading] = useState(true);

  const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 0.02,
        maxWidth: "75vw",
        marginTop: "30px",
      }}
    />
  );
  const { slug } = useParams();
  const [article, setArticle] = useState({
    username: "",
    image: "",
    title: "",
    description: "",
    createdAt: "",
    body: "",
    tagList: [],
  });
  const [comment, setComment] = useState({
    comment: "",
    Loading: false,
  });

  const handleDelete = async () => {
    await deleteArticle(slug);
    history.push(`/profile/${username}`);
  };
  useEffect(() => {
    const getArticle = async () => {
      const data = await getArticleBySlug(slug);
      const {
        author: { username, image },
        createdAt,
        body,
        title,
        description,
        tagList,
      } = data.article;
      setArticle({
        username,
        image,
        title,
        description,
        body,
        createdAt,
        tagList,
      });
      setLoading(false);
    };
    getArticle();
  }, []);

  const sendComment = async () => {
    if (isLoggedIn === true) {
      setComment({ ...comment, Loading: true });
      const res = await postComment(slug, comment.comment);

      if (res.comment) {
        setComment({ comment: "", Loading: false });
        const cmtBox = document.getElementById("CommentBox");
        window.scrollTo({ top: cmtBox.scrollHeight, behaviour: "smooth" });
      }
    } else {
      history.push("/signin");
    }
  };

  const handleChange = (e) => {
    setComment({ ...comment, [e.target.name]: e.target.value });
  };
  return (
    <ArticleContainer>
      <ArticleBanner>
        {isLoading === true ? (
          <Loader
            type="TailSpin"
            color="#fff"
            height={30}
            width={30}
            style={{ marginTop: "50px" }}
          />
        ) : (
          <>
            <h2>{article.title}</h2>
            <Author>
              <img src={article.image} alt="avatar" />
              <div>
                <h4
                  onClick={() => history.push(`/profile/${article.username}`)}
                  style={author}
                >
                  {article.username}
                </h4>
                <p>{article.createdAt}</p>
              </div>
              {isLoggedIn && article.username === username ? (
                <>
                  <button
                    onClick={() =>
                      history.push({
                        pathname: "/newpost",
                        state: {
                          title: article.title,
                          description: article.description,
                          body: article.body,
                          tagList: article.tagList,
                          slug,
                        },
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faEdit} /> Edit Article
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{ borderColor: "#b85c5c", color: "#b85c5c" }}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                    Delete Article
                  </button>
                </>
              ) : null}
            </Author>
          </>
        )}
      </ArticleBanner>
      <Body>
        {isLoading === true ? (
          <Loader
            type="TailSpin"
            color="#5cb85c"
            height={80}
            width={80}
            style={{ marginTop: "50px" }}
          />
        ) : (
          <ReactMarkdown children={article.body} />
          // <ArticleBody>{article.body}</ArticleBody>
        )}
      </Body>
      <ColoredLine color="gray" />
      <CommentBox id="CommentBox">
        <textarea
          name="comment"
          value={comment.comment}
          onChange={handleChange}
        />
        <ButtonBox onClick={sendComment}>
          <button>Post a comment</button>
        </ButtonBox>
      </CommentBox>
      <Comments slug={slug} Loading={comment.Loading} />
    </ArticleContainer>
  );
}

const ArticleContainer = styled.div`
  margin-bottom: 100px;
  max-width: 100vw;
  overflow-x: hidden;
`;

const ArticleBanner = styled.div`
  background: #333;
  color: white;
  padding: 20px;
  > h2 {
    font-size: 30px;
  }
`;
const CommentBox = styled.div`
  margin-top: 75px;
  display: flex;
  flex-direction: column;
  place-items: center;
  margin-bottom: 50px;
  > textarea {
    min-width: 550px;
    min-height: 20vh;
    border: 1px solid #e5e5e5;
    font-family: "poppins";
  }
`;
const ButtonBox = styled.div`
  border: 1px solid #e5e5e5;
  box-shadow: none !important;
  font-size: 0.8rem;
  font-weight: 300;
  padding: 0.75rem 1.35rem;
  background-color: #f5f5f5;
  min-width: 550px;
  box-shadow: none !important;
  > button {
    font-weight: 600;
    float: right;
    padding: 0.65rem 0.65rem;
    font-size: 0.775rem;
    border-radius: 0.2rem;
    color: #fff;
    background-color: #5cb85c;
    border-color: #5cb85c;
    border: none;
    cursor: pointer;
  }
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  margin-top: 30px;
  max-width: 75vw;
`;
const ArticleBody = styled.div``;
const Author = styled.div`
  display: flex;
  align-items: center;
  > img {
    height: 32px;
    width: 32px;
    border-radius: 30px;
  }
  > div {
    margin-top: 0.5rem;
    margin-left: 0.5rem;
    > h4 {
      font-size: 10px;
      margin: 0px;
    }
    > p {
      font-size: 10px;
      margin-top: 0px;
      margin-right: 1.5rem;
    }
  }
  > button {
    font-size: 0.875rem;
    border-radius: 0.2rem;
    display: inline-block;
    // font-weight: 400;
    font-size: 12px;

    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    border: 1px solid transparent;
    color: #ccc;
    background-image: none;
    background-color: transparent;
    border-color: #ccc;
    max-height: fit-content;
  }
`;
const author = {
  cursor: "pointer",
  color: "#5cb85c",
};
export default ArticleDisplay;
