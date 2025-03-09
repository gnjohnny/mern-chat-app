import React from "react";
import { UseAuthStore } from "../store/Auth.Store";
import { useProfileStore } from "../store/profile.store";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ChatPage from "./ChatPage";

const HomePage = () => {
    const { userProfile } = useProfileStore();
    const { logOut, logOutStatus } = UseAuthStore();

    const navigate = useNavigate();

    if (logOutStatus == "OK") navigate("/login");
    return (
        <main className="w-full min-h-screen">
            <NavBar />
            <div className="mt-[57px] min-h-[90vh] w-full md:p-4 fixed">
                <ChatPage />
            </div>
        </main>
    );
};

export default HomePage;
