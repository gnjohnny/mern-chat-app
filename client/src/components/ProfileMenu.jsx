import React, { useEffect, useRef } from "react";
import { useProfileStore } from "../store/profile.store";
import { LuLogOut } from "react-icons/lu";
import { UseAuthStore } from "../store/Auth.Store";
import { Link } from "react-router-dom";

const ProfileMenu = ({ showMenu, setShowMenu }) => {
    const { userProfile } = useProfileStore();
    const { logOut } = UseAuthStore();
    const dropDownRef = useRef(null);

    useEffect(() => {
        const handleClickOutSide = (event) => {
            if (
                dropDownRef.current &&
                !dropDownRef.current.contains(event.target)
            ) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutSide);

        return () =>
            document.removeEventListener("mousedown", handleClickOutSide);
    }, [dropDownRef, setShowMenu]);
    return (
        <div
            className="w-[350px] min-h-[250px] flex  flex-col rounded-[22px] p-[10px] fixed top-[76px] right-6 shadow-md z-50 gap-3 bg-[var(--secondary)] shadow-base-100"
            onClick={() => setShowMenu(!showMenu)}
            ref={dropDownRef}
        >
            <div className="w-full flex justify-center items-center flex-col">
                <h1 className="text-[var(--neutral_text)] font-bold text-2xl">
                    {userProfile?.name}
                </h1>
                <p className="text-[var(--neutral_text)] font-semibold text-lg">
                    {userProfile?.bio}
                </p>
            </div>
            <hr className="text-[var(--neutral_text)] w-full" />
            <div className="w-full flex justify-center items-center flex-col gap-y-3">
                <button className="text-white text-center font-bold w-full p-4 shadow-sm shadow-black cursor-pointer hover:bg-[var(--primary)] transition duration-300 border-none">
                    <Link to={"/profile/update/" + userProfile._id}>
                        {" "}
                        Update profile
                    </Link>
                </button>
                <button
                    className="flex justify-center items-center gap-2 text-white text-center font-bold w-full p-4 shadow-sm shadow-black cursor-pointer hover:bg-[var(--primary)] transition duration-300 border-none"
                    onClick={logOut}
                >
                    <LuLogOut /> Log out
                </button>
            </div>
            <hr className="text-[var(--neutral_text)] w-full" />
            <div className="w-full flex justify-center items-center">
                <p className="text-[var(--neutral_text)] font-semibold text-sm">
                    Privacy policy - All rights reserved
                </p>
            </div>
        </div>
    );
};

export default ProfileMenu;
