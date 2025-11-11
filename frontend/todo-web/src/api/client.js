import axios from "axios";
export const api = axios.create({ baseURL: "http://localhost:5205/api" });

const t = localStorage.getItem("token");
if (t) api.defaults.headers.common.Authorization = `Bearer ${t}`;

api.interceptors.response.use(
  r => r,
  err => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      delete api.defaults.headers.common.Authorization;
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
