import { create } from "zustand";
import { axiosInstance } from "../lib/axios.lib";
import toast from "react-hot-toast";
import { socket } from "../socket/socket.config";

let typingTimeOut;

export const useMessageStore = create((set) => ({
    messages: [],

    getMessages: async (id) => {
        try {
            const res = await axiosInstance.get(`/messages/all/${id}`);
            set({
                messages: res.data.messages,
            });

            if (socket) {
                socket.emit("join", id);

                socket.off("newMessage").on("newMessage", (msg) => {
                    set((state) => {
                        if (state.messages.some((m) => m._id === msg._id)) {
                            return state;
                        }

                        return { messages: [...state.messages, msg] };
                    });
                });
            }
        } catch (error) {
            console.log("Error in get message controller", error.message);
        }
    },

    sendMessages: async (id, message, media) => {
        try {
            const res = await axiosInstance.post(`/messages/send/${id}`, {
                message,
                media,
            });

            socket.emit("newMessage", res.data.newMessage);
            set((state) => ({
                messages: [...state.messages, res.data.newMessage],
            }));

            toast.success(res.data.msg || "Message sent successfully");
        } catch (error) {
            console.log("Error in send message func", error.message);
            toast.error(
                error.response.data.msg || "something went wrong try again",
            );
        }
    },

    updateMessage: async (data) => {},

    deleteMessages: async (id) => {},
}));
