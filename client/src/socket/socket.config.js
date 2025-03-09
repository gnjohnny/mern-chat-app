import { io } from "socket.io-client";

export const socket = io("https://chatty-5vu9.onrender.com", {
    withCredentials: true,
    autoConnect: false,
});

