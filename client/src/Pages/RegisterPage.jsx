import { useEffect, useState } from "react";
import { LuMessageSquareMore } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { UseAuthStore } from "../store/Auth.Store";

const RegisterPage = () => {
    const divs = Array(9).fill("");
    const { Register, registerLoad, registerStatus } = UseAuthStore();
    const [authData, setAuthData] = useState({
        email: "",
        username: "",
        password: "",
    });

    const navigate = useNavigate();

    const data = {
        email: authData.email,
        username: authData.username,
        password: authData.password,
    };

    const handleSubmit = (e, info) => {
        e.preventDefault();
        try {
            Register(info);
        } catch (error) {
            console.log("Error registering user", error.message);
        }
    };

    useEffect(() => {
        if (registerStatus == "Created") {
            navigate("/login");
        }
    }, [registerStatus, navigate]);
    return (
        <div className="auth_container">
            <div className="auth_form_container">
                <div className="text-[var(--neutral_text)] font-bold">
                    <LuMessageSquareMore size={48} />
                </div>
                <h1 className="text-lg font-bold text-[var(--light_text)]">
                    Register A New Chatty Account
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
                        required
                        className="auth_form_input"
                        placeholder="Input your email..."
                        onChange={(e) =>
                            setAuthData((prev) => ({
                                ...prev,
                                email: e.target.value,
                            }))
                        }
                    />
                    <label htmlFor="username" className="auth_form_label">
                        Username:{" "}
                    </label>
                    <input
                        type="text"
                        id="username"
                        required
                        className="auth_form_input"
                        placeholder="Input your username..."
                        onChange={(e) =>
                            setAuthData((prev) => ({
                                ...prev,
                                username: e.target.value,
                            }))
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
                            setAuthData((prev) => ({
                                ...prev,
                                password: e.target.value,
                            }))
                        }
                    />

                    <button className="auth_form_button">
                        {registerLoad ? (
                            <span className="loading loading-spinner loading-xl"></span>
                        ) : (
                            "Register"
                        )}
                    </button>

                    <p className="my-3 text-[var(--light_text)] text-md font-light">
                        Already have an account ?{" "}
                        <Link to={"/login"} className="font-bold underline">
                            Log In
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
                    Great Choice To Join Chatty Platform. A Guaranteed Hapiness
                    You Are About To Unleash
                </h1>
                <p className="text-md font-semibold text-[var(--dark_text)]">
                    Please register to unlock the fun awaiting 😎 ?
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
