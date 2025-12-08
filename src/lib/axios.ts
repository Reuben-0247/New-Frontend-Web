import { TOKEN_NAME } from "@/utils/constant";
import axios from "axios";
import Cookies from "js-cookie";

const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosApi.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_NAME);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosApi;

const API_URL = process.env.NEXT_PUBLIC_API_URL;
axios.defaults.baseURL = API_URL;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
