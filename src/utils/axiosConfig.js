import axios from "axios";
import { API_URL } from "../../constants";
import { toast } from "react-toastify";

const Axios = axios.create({
  baseURL: API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// REQUEST INTERCEPTOR
Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// RESPONSE INTERCEPTOR
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "An error occurred";
    toast.error(message);

    // if (error?.response?.status === 401) {
    //   localStorage.removeItem("token");
    //   window.location.href = "/";
    // }
    return Promise.reject(error);
  },
);

export default Axios;
