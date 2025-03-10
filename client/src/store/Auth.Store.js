import { create } from "zustand";
import { axiosInstance } from "../lib/axios.lib";
import toast from "react-hot-toast";
import { useProfileStore } from "./profile.store";
import { socket } from "../socket/socket.config";

export const UseAuthStore = create((set, get) => ({
    checkAuthLoad: false,
    gettingUsersLoad: false,
    authUser: null,
    users: [],
    profiles: [],
    userProfile: useProfileStore.getState().userProfile,
    registerLoad: false,
    logInLoad: false,
    registerStatus: null,
    loginStatus: null,
    logOutStatus: null,

    checkAuth: async () => {
        try {
            set({ checkAuthLoad: true });
            const res = await axiosInstance.get("/auth/user");
            if (res.data?.authUser) {
                set({ authUser: res.data.authUser });
            }
        } catch (error) {
            console.log("Error in checking auth func", error.message);
        } finally {
            set({ checkAuthLoad: false });
        }
    },

    getAllUsers: async () => {
        try {
            set({ gettingUsersLoad: true });
            const res = await axiosInstance.get("/auth/all-users");
            set({
                users: res.data.users,
                profiles: res.data.profiles,
            });
        } catch (error) {
            console.log("Error in getting all users func");
            set({
                users: [],
            });
        } finally {
            set({
                gettingUsersLoad: false,
            });
        }
    },

    Register: async (data) => {
        try {
            set({ registerLoad: true });
            const res = await axiosInstance.post("/auth/register", data);
            toast.success(res.data.msg || "Registered successfully");
            set({ registerStatus: res.status });
        } catch (error) {
            console.log("Error in register func", error.message);
            toast.error(error.response.data.msg || "Something went wrong");
        } finally {
            set({ registerLoad: false });
        }
    },

    logIn: async (data) => {
        try {
            set({ logInLoad: true });
            const res = await axiosInstance.post("/auth/login", data);
            toast.success(res.data.msg || "Logged in successfully");
            socket.connect();
            set({
                authUser: res.data.foundUserwithoutPassword,
                loginStatus: res.status,
            });
        } catch (error) {
            console.log("Error in log in func", error.message);
            toast.error(error.response.data.msg || "Something went wrong");
        } finally {
            set({ logInLoad: false });
        }
    },

    logOut: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout");
            socket.on("disconnect", () => {
                toast.success("User disconnected ");
            });
            set({
                authUser: null,
                userProfile: null,
                logOutStatus: res.status,
            });
            toast.success(res.data.msg || "Logged out successfully");
        } catch (error) {
            console.log("Error in log out func", error.message);
            toast.error(error.response.data.msg || "Something went wrong");
        }
    },
}));
