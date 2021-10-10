import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { login } from "../../features/authentication/authSlice.js";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  isLoading,
  isUserLoggedIn,
  error,
} from "../../features/authentication/authSlice.js";
import Loader from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import SignInIllustration from "../../assets/auth_green.svg";
import { PASSWORD_ERROR, EMAIL_ERROR } from "../../constants/AuthErrors";

var validator = require("email-validator");

function SignIn() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    validationError: "",
  });

  const isLoggedIn = useSelector(isUserLoggedIn);
  const err = useSelector(error);
  const loading = useSelector(isLoading);
  const handleChange = (e) => {
    setFormState({
      ...formState,
      validationError: "",
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formState.password.length < 6) {
      setFormState({
        ...formState,
        validationError: PASSWORD_ERROR,
      });
      return;
    } else if (!validator.validate(formState.email)) {
      setFormState({
        ...formState,
        validationError: EMAIL_ERROR,
      });
      return;
    }

    await dispatch(login(formState))
      .then((res) => {
        history.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (isLoggedIn === true) history.push("/");
  }, []);

  return (
    <>
      <PageContainer>
        <LeftContainer>
          <img style={signin} src={SignInIllustration} alt="Sign In" />
        </LeftContainer>
        <SignInContainer>
          <SignInForm>
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
            <h3>Log Into Condult</h3>
            <Link to="/signup" style={needaccount}>
              Need a account
            </Link>
            <input
              name="email"
              onChange={handleChange}
              value={formState.email}
              type="email"
              placeholder="Email"
              required
            />
            <input
              name="password"
              onChange={handleChange}
              value={formState.password}
              type="password"
              placeholder="Password"
              required
            />
            {err && err.page === "signin" && (
              <>
                {Object.entries(err.error).map(([key, val]) => {
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
              <h1
                style={{
                  color: "#ff0033",
                  fontWeight: 500,
                  fontSize: "0.95em",
                }}
              >
                {formState.validationError}
              </h1>
            )}
            <button onClick={handleSubmit}>Sign In</button>
          </SignInForm>
        </SignInContainer>
      </PageContainer>
    </>
  );
}

const PageContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: calc(100vh - 70px);
`;
const SignInContainer = styled.div`
  flex: 1;
`;
const LeftContainer = styled.div`
  display: flex;
  place-items: center;
  height: 100%;
  width: 50vw;
  background-color: #5cb85c;
`;

const SignInForm = styled.div`
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
    // width: 465px;
  }
`;
const needaccount = {
  textDecoration: "none",
  fontSize: "15px ",
  color: "#5cb85c",
};

const LoadingSpin = styled.div`
  position: absolute;
`;

const signin = {
  maxWidth: "500px",
  maxHeight: "600px",
};
export default SignIn;
