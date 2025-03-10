import http from "http";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { ioConfig } from "./config/socket.config.js";
import AuthRoutes from "./routes/Auth.routes.js";
import ProfileRoutes from "./routes/Profile.routes.js";
import MessagesRoutes from "./routes/messages.route.js";

import { connectDB } from "./db/db.js";
import { checkAuth } from "./utils/checkAuth.utils.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

const server = http.createServer(app);

export const io = ioConfig(server);

io.on("connection", (socket) => {
    socket.on("newMessage", (msg) => {
        io.to(msg.receiver).emit("newMessage", msg);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: "https://chatty-5vu9.onrender.com",
        credentials: true,
    }),
);

const PORT = process.env.PORT || 4000;

app.use("/api/auth", AuthRoutes);
app.use("/api/profile", checkAuth, ProfileRoutes);
app.use("/api/messages", checkAuth, MessagesRoutes);

app.get("/api/test", (req, res) => {
    return res.status(200).json({
        success: true,
        msg: "This is a test route",
    });
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "client/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log("Server running on port: ", PORT);
    connectDB();
});
