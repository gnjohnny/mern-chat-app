import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import { Toaster } from "react-hot-toast";
import { UseAuthStore } from "./store/Auth.Store";
import { useEffect } from "react";
import LogInPage from "./Pages/LogInPage";
import RegisterPage from "./Pages/RegisterPage";
import ProfilePage from "./Pages/ProfilePage";
import UpdateProfile from "./Pages/UpdateProfile";

const App = () => {
    const { checkAuthLoad, authUser, checkAuth } = UseAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (checkAuthLoad)
        return (
            <div className="auth_loader">
                <span className="loading loading-infinity h-18 w-18"></span>
            </div>
        );

    return (
        <>
            <Routes>
                <Route path="/login" element={<LogInPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                    path="/"
                    element={
                        authUser ? <HomePage /> : <Navigate to={"/login"} />
                    }
                />
                <Route path="/profile/update/:id" element={<UpdateProfile />} />
            </Routes>
            <Toaster />
        </>
    );
};

export default App;
