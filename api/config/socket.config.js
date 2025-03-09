import { Server } from "socket.io";

export const ioConfig = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });
    return io;
};
