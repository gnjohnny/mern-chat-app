import React, { useState } from "react";
import { LuMessageCircleDashed } from "react-icons/lu";
import { useProfileStore } from "../store/profile.store";
import ProfileMenu from "./ProfileMenu";

const NavBar = () => {
    const { userProfile } = useProfileStore();

    const [showMenu, setShowMenu] = useState(false);
    return (
        <header className="header">
            <nav className="nav">
                <h1 className="text-[var(--neutral_text)] font-bold text-3xl flex gap-x-2 justify-center items-center">
                    <LuMessageCircleDashed /> Chatty
                </h1>

                <div className="flex justify-center items-center gap-x-3">
                    <div
                        className="w-[45px] h-[45px] rounded-full bg-[var(--neutral_text)]/90  shadow-sm shadow-base-100"
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        <img
                            src={userProfile.profileImage}
                            alt="profile pic"
                            className="w-full h-full rounded-full"
                        />
                    </div>
                    <h1 className="text-[var(--neutral_text)] font-bold text-lg">
                        {userProfile?.name}
                    </h1>
                    {showMenu && (
                        <ProfileMenu
                            showMenu={showMenu}
                            setShowMenu={setShowMenu}
                        />
                    )}
                </div>
            </nav>
        </header>
    );
};

export default NavBar;
