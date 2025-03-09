import mongoose, { Schema } from "mongoose";

const profileSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
            required: true,
        },
        name: {
            type: String,
        },
        profileImage: {
            type: String,
            default: "/avatar.webp",
        },
        profileImageId: {
            type: String,
        },
        bio: {
            type: String,
            default: "New to chat app",
        },
    },
    { timestamps: true },
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
