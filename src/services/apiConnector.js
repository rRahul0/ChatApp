import axios from "axios";
import { AuthEndpoints } from "./apis";
import { setToken } from "../slices/authSlice";
import { setUser } from "../slices/profileSlice";
import { store } from '../main'
import { Navigate } from "react-router-dom";

export const axiosInstance = axios.create({});

let retryCount = 0;
const maxRetry = 3;

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    withCredentials: true,
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (retryCount < maxRetry) retryCount++;
      else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        store.dispatch(setToken(null));
        store.dispatch(setUser(null));
        window.location.href = "/login";
      }
      try {
        const userId = JSON.parse(localStorage.getItem("user"))._id;
        const response = await apiConnector('POST', AuthEndpoints.REFRESHTOKEN_API, { userId });
        if (response.status === 200) {
          const newAccessToken = response.data.token;
          localStorage.setItem(
            "token",
            JSON.stringify(newAccessToken)
          );
          store.dispatch(setToken(newAccessToken));
          error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance.request(error.config);
        }
      } catch (refreshError) {
        console.error("Failed to refresh token", refreshError);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        store.dispatch(setToken(null));
        store.dispatch(setUser(null));
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);