import axios from "axios";

export const indicadoresClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_INDICATORS_API_URL || process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "1",
    },
});