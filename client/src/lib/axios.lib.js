import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://chatty-5vu9.onrender.com/api",
    withCredentials: true,
});
