import axios from "axios"

export const indicadoresClient = axios.create({
    baseURL: "http://localhost:8002", 
})

indicadoresClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})