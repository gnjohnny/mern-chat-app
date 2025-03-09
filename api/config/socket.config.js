import { Server } from "socket.io";

export const ioConfig = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "https://chatty-5vu9.onrender.com",
            credentials: true,
        },
    });
    return io;
};
