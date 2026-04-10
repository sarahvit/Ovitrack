import axios from "axios";

export const indicadoresClient = axios.create({
  baseURL: "/api/indicators",
  headers: {
    "Content-Type": "application/json",
  },
});