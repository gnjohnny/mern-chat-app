import { useEffect, useState } from "react";
import { LuMessageSquareMore } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { UseAuthStore } from "../store/Auth.Store";
import { useProfileStore } from "../store/profile.store";

const LogInPage = () => {
    const { logIn, logInLoad, loginStatus} = UseAuthStore();
    const {getProfile, userProfile} = useProfileStore()
    const divs = ["", "", "", "", "", "", "", "", ""];
    const [authData, setAuthData] = useState({
        email: "",
        password: "",
    });

    const data = {
        email: authData.email,
        password: authData.password,
    };

    const navigate = useNavigate();
    const handleSubmit = async (e, info) => {
        e.preventDefault();
        logIn(info);
        getProfile();
    };

    useEffect(() => {
        if (loginStatus === "OK") {
            if (userProfile) {
                navigate("/");
            } else {
                navigate("/profile");
            }
        }
    }, [loginStatus, userProfile]);

    return (
        <div className="auth_container">
            <div className="auth_form_container">
                <div className="text-[var(--neutral_text)] font-bold">
                    <LuMessageSquareMore size={48} />
                </div>
                <h1 className="text-lg font-bold text-[var(--light_text)]">
                    Log In To Your Chatty Account
                </h1>
                <form
                    className="auth_form"
                    onSubmit={(e) => handleSubmit(e, data)}
                >
                    <label htmlFor="email" className="auth_form_label">
                        Email:{" "}
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="auth_form_input"
                        required
                        placeholder="Input your email..."
                        onChange={(e) =>
                            setAuthData({ ...authData, email: e.target.value })
                        }
                    />

                    <label htmlFor="password" className="auth_form_label mt-6">
                        Password:{" "}
                    </label>
                    <input
                        type="password"
                        id="password"
                        required
                        className="auth_form_input"
                        placeholder="Input your password..."
                        onChange={(e) =>
                            setAuthData({
                                ...authData,
                                password: e.target.value,
                            })
                        }
                    />

                    <button className="auth_form_button" type="submit">
                        {logInLoad ? (
                            <span className="loading loading-spinner loading-xl"></span>
                        ) : (
                            "Log In"
                        )}
                    </button>

                    <p className="my-3 text-[var(--light_text)] text-md font-light">
                        Don't have an account ?{" "}
                        <Link to={"/register"} className="font-bold underline">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
            <div className="auth_grid_cont">
                <div className="auth_grids">
                    {divs.map((div, idx) => (
                        <div
                            className="w-[110px] h-[110px] bg-[var(--secondary)]/40 rounded-lg"
                            key={idx}
                        ></div>
                    ))}
                </div>
                <h1 className="my-3 font-bold text-4xl text-[var(--dark_text)] text-center">
                    Welcome To Back. We Missed you😊
                </h1>
                <p className="text-md font-semibold text-[var(--dark_text)]">
                    How have been since last ?
                </p>
            </div>
        </div>
    );
};

export default LogInPage;
