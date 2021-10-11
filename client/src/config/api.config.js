import Axios from "axios";
import { API_BASE_URL } from "../constants/api";
import myLog from "../utils/myLog";
import { useHistory } from "react-router-dom";

// const history = use;
const axios = Axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
  withCredentials: true,
});
axios.defaults.withCredentials = true;

axios.interceptors.request.use((request) => {
  myLog(
    `------------------ \nRequest to ${request.method.toUpperCase()} ${
      request.url
    } with params`,
    request.params,
    `and data`,
    request.data
  );
  return request;
});

axios.interceptors.response.use(
  (response) => {
    myLog(
      `------------------ \nResponse from ${response.config.method.toUpperCase()} ${
        response.config.url
      } with params`,
      response.config.params,
      `and data`,
      response.config.data,
      `and got response data ->`,
      response.data
    );
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.response.refreshTokenError !== true
    ) {
      try {
        const res = await Axios.post("/refresh");
        return axios.request(originalRequest, { withCredentials: true });
      } catch (err) {
        if (err.response.status === 401) {
          // refresh token expired
          if (localStorage.getItem("user")) localStorage.removeItem("user");
          window.location.href = "/signin";
        }
      }
    } else {
      if (localStorage.getItem("user")) localStorage.removeItem("user");

      window.location.href = "/signin";
    }
  }
);

export default axios;
