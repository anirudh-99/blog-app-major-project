import axios from "axios";
import { API_URL } from "./constants";
import store from "./redux/store/store";

const token = window.localStorage.getItem("token");

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

axiosInstance.interceptors.request.use((req) => {
  const { auth } = store.getState();
  if (auth.token) {
    req.headers.Authorization = `Bearer ${auth.token}`;
  }
  return req;
});

export default axiosInstance;
