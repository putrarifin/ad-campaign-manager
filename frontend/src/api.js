import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // backend kamu di Docker expose ke host
});

export default api;
