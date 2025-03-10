import React, { useEffect, useState } from "react";
import { LuCircleFadingPlus } from "react-icons/lu";
import { useProfileStore } from "../store/profile.store";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
    const {
        updateProfileLoad,
        updateProfile,
        status,
        getProfile,
        userProfile,
    } = useProfileStore();

    useEffect(() => {
        getProfile();
    }, [getProfile]);

    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        name: "",
        media: "",
        bio: "",
    });

    useEffect(() => {
        if (userProfile) {
            setProfile({
                name: userProfile.name,
                media: userProfile.profileImage,
                bio: userProfile.bio,
            });
        }
    }, [userProfile]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                setProfile({ ...profile, media: reader.result });
            };

            reader.readAsDataURL(file);
        }
    };

    const data = {
        name: profile.name,
        media: profile.media,
        bio: profile.bio,
    };

    const handleSubmit = (e, info) => {
        e.preventDefault();
        try {
            updateProfile(info);
        } catch (error) {
            console.log("Error updating profile", error.message);
        }
    };

    useEffect(() => {
        if (status == "OK") {
            navigate("/");
        }
    }, [status, navigate]);
    return (
        <div className="profile_page_cont">
            <form
                className=" profile_form"
                onSubmit={(e) => handleSubmit(e, data)}
            >
                <div className="profile_form_cont">
                    <div className="profile_form_upload_cont">
                        <h4 className="text-[var(--neutral_text)] font-bold my-2">
                            Upload an image
                        </h4>
                        <div
                            className="w-[80px] h-[80px] md:w-[150px] md:h-[150px] bg-white/40 rounded-sm"
                            style={{
                                backgroundImage: `url(
                                   ${profile.media ? profile.media : ""}
                                )`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                            }}
                        >
                            <label
                                htmlFor="photo"
                                className="profile_form_upload_label"
                            >
                                <input
                                    type="file"
                                    id="photo"
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e)}
                                />
                                <LuCircleFadingPlus size={38} />
                            </label>
                        </div>
                    </div>
                    <div className="flex-1 w-full h-full flex  flex-col gap-1">
                        <h4 className="text-[var(--neutral_text)] font-bold my-2 text-center underline">
                            Create a stunning bio for yourself 😊!
                        </h4>

                        <label
                            htmlFor="name"
                            className="text-md text-white font-semibold"
                        >
                            Enter your new name to update:
                        </label>

                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={profile.name}
                            className="border-2 border-white/40 rounded-sm outline-none focus:ring-2 focus:ring-[var(--primary)] p-2 text-white text-md"
                            onChange={(e) =>
                                setProfile((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                        />

                        <label
                            htmlFor="bio"
                            className="text-md text-white font-semibold"
                        >
                            Write your bio here:{" "}
                        </label>
                        <textarea
                            name="bio"
                            id="bio"
                            value={profile.bio}
                            rows={3}
                            className="border-2 border-white/40 rounded-sm outline-none focus:ring-2 p-1 text-white text-md"
                            onChange={(e) =>
                                setProfile((prev) => ({
                                    ...prev,
                                    bio: e.target.value,
                                }))
                            }
                        ></textarea>
                    </div>
                </div>
                <button className="profile_form_button" type="submit">
                    {updateProfileLoad ? (
                        <span className="loading loading-spinner loading-md"></span>
                    ) : (
                        "Update Profile"
                    )}
                </button>
            </form>
        </div>
    );
};

export default UpdateProfile;
