import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../features/authentication/authSlice.js";
import {
  isLoading,
  isUserLoggedIn,
  error,
} from "../../features/authentication/authSlice.js";
import Loader from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import SignInIllustration from "../../assets/auth_green.svg";
import {
  EMAIL_ERROR,
  USERNAME_ERROR,
  PASSWORD_EMPTY,
} from "../../constants/AuthErrors";

var validator = require("email-validator");

function SignUp() {
  const validUsername = new RegExp("/^[a-zA-Z0-9]{3,}$/");
  const dispatch = useDispatch();
  const history = useHistory();
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    validationError: "",
  });
  let btnRef = useRef();

  const loading = useSelector(isLoading);
  const isLoggedIn = useSelector(isUserLoggedIn);
  const checkError = useSelector(error);

  useEffect(() => {
    if (isLoggedIn === true) {
      history.push("/");
    }
  }, []);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
      validationError: "",
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validator.validate(formState.email)) {
      setFormState({
        ...formState,
        validationError: EMAIL_ERROR,
      });
      return;
    } else if (!validUsername.test(formState.username)) {
      setFormState({ ...formState, validationError: USERNAME_ERROR });
      return;
    } else if (formState.password.trim.length === 0) {
      setFormState({ ...formState, validationError: PASSWORD_EMPTY });
      return;
    }

    if (btnRef.current) {
      btnRef.current.setAttribute("disabled", "disabled");
    }
    await dispatch(signup(formState))
      .then((res) => {
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
    btnRef.current.removeAttribute("disabled");
  };
  return (
    <PageContainer>
      <SignUpContainer>
        <SignUpForm>
          <LoadingSpin>
            {loading === true && (
              <Loader
                type="TailSpin"
                color="#5cb85c"
                height={50}
                width={50}
                style={{ marginTop: "50px" }}
              />
            )}
          </LoadingSpin>

          <h3>Sign Up</h3>
          <Link to="/signin" style={link}>
            Have an account?
          </Link>
          <input
            onChange={handleChange}
            name="username"
            value={formState.username}
            type="text"
            placeholder="Username"
            required
          />
          <input
            onChange={handleChange}
            name="email"
            value={formState.email}
            type="email"
            placeholder="Email"
            required
          />
          <input
            onChange={handleChange}
            name="password"
            value={formState.password}
            type="password"
            placeholder="Password"
            required
          />
          {checkError && checkError.page === "signup" && (
            <>
              {Object.entries(checkError.error).map(([key, val]) => {
                return (
                  <>
                    <span style={{ color: "#ff0033", fontWeight: 500 }}>
                      {key} {val}
                    </span>
                  </>
                );
              })}
            </>
          )}
          {formState.validationError && (
            <span
              style={{
                color: "#ff0033",
                fontWeight: 500,
                maxWidth: "300px",
              }}
            >
              {formState.validationError}
            </span>
          )}
          <button ref={btnRef} type="submit" onClick={handleSubmit}>
            Sign Up
          </button>
        </SignUpForm>
      </SignUpContainer>
      <RightContainer>
        <img style={signin} src={SignInIllustration} alt="Sign In" />
      </RightContainer>
    </PageContainer>
  );
}
const PageContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: calc(100vh - 70px);
`;
const RightContainer = styled.div`
  display: flex;
  place-items: center;
  height: 100%;
  width: 50vw;
  background-color: #5cb85c;
  margin-right: 0;
  justify-content: center;
`;
const SignUpContainer = styled.div`
  flex: 1;
`;
const SignUpForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > h3 {
    font-weight: 700;
    line-height: 1.1;
    font-size: 45px;
  }
  > input {
    padding: 1.25rem 1.5rem;
    border-radius: 0.3rem;
    border: 1px solid rgba(0, 0, 0, 0.15);
    margin-top: 10px;
    min-width: 400px;
    font-size: 1.05em;
  }
  > button {
    display: inline-block;
    padding: 1rem 2rem;
    font-size: 1rem;
    border-radius: 0.3rem;
    color: #fff;
    background-color: #5cb85c;
    border-color: #5cb85c;
    border: none;
    margin-top: 15px;
    cursor: pointer;
    min-width: 400px;
    :hover {
      cursor: pointer;
    }
    &:disabled {
      background-color: #5cb85b;
      cursor: not-allowed;
    }
  }
`;
const LoadingSpin = styled.div`
  position: absolute;
`;
const link = {
  textDecoration: "none",
  fontSize: "15px ",
  color: "#5cb85c",
};
const signin = {
  maxWidth: "500px",
  maxHeight: "600px",
};
export default SignUp;
