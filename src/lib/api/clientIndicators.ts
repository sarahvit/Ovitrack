import axios from "axios"

export const indicadoresClient = axios.create({
    baseURL: "http://127.0.0.1:8004/",
})

indicadoresClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})