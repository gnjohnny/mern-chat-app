import { create } from "zustand";
import { axiosInstance } from "../lib/axios.lib";
import toast from "react-hot-toast";

export const useProfileStore = create((set, get) => ({
    createProfileLoad: false,
    updateProfileLoad: false,
    userProfile: null,
    status: null,

    getProfile: async () => {
        try {
            const res = await axiosInstance.get("/profile/my");
            set({ userProfile: res.data.foundProfile });
        } catch (error) {
            console.log("Error in get profile func", error.message);
        }
    },

    createProfile: async (data) => {
        try {
            set({
                createProfileLoad: true,
            });

            const res = await axiosInstance.post("/profile/create", data);
            if (res.data) {
                set({
                    userProfile: res.data.newProfile,
                    status: res.status,
                });
            }
            toast.success(res.data.msg || "Profile created successfully");
        } catch (error) {
            console.log("Error in create profile func", error.message);
            toast.error(error.response.data.msg || "Something went wrong");
        } finally {
            set({
                createProfileLoad: false,
            });
        }
    },

    updateProfile: async (data) => {
        try {
            set({ updateProfileLoad: true })
            const res = await axiosInstance.post("/profile/update", data);
            if (res.data) {
                set({
                    userProfile: res.data.profile,
                    status: res.status
                });
            }
            toast.success(res.data.msg || "Profile updated successfully")
        } catch (error) {
            console.log("Error in update profile func", error.message);
            toast.error(error.response.data.msg || "Something went wrong");
        } finally {
            set({ updateProfileLoad: false })
        }
    }
}));
