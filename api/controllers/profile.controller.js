import cloudinary from "../config/cloudinary.config.js";
import Auth from "../models/auth.model.js";
import Profile from "../models/profile.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.utils.js";

export const getProfile = async (req, res) => {
    try {
        const user = req.user.id;

        const foundProfile = await Profile.findOne({ userId: user });

        if (!foundProfile)
            return res.status(404).json({
                success: false,
                msg: "Profile not found",
            });

        return res.status(200).json({
            success: false,
            foundProfile,
        });
    } catch (error) {
        console.error("Error in get profile controller", error.message);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
};

export const createProfile = async (req, res) => {
    try {
        let { media, bio } = req.body;
        const user = await Auth.findById(req.user.id);

        if (!user)
            return res.status(404).json({
                success: false,
                msg: "User not found",
            });

        const name = `@${user.username}`;

        let profileImage;
        let profileImageId;

        if (typeof media == "string" && media.startsWith("data:image")) {
            try {
                const uploadRes = await uploadToCloudinary(media, "image");
                if (uploadRes.success === true) {
                    profileImage = uploadRes.secure_url;
                    profileImageId = uploadRes.public_id;
                }
            } catch (error) {
                console.log("Error uploading image", error.message);
                return res.status(400).json({
                    success: false,
                    msg: "Error uploading your image",
                });
            }
        }

        const newProfile = new Profile({
            userId: req.user.id,
            name,
            profileImage,
            profileImageId,
            bio,
        });

        await newProfile.save();

        return res.status(201).json({
            success: true,
            msg: "Profile created successfully",
            newProfile,
        });
    } catch (error) {
        console.error("Error in create profile controller", error.message);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { name, media, bio } = req.body;

        const userId = req.user.id;

        const profile = await Profile.findOne({ userId: userId });

        if (!profile)
            return res.status(404).json({
                success: false,
                msg: "Profile not found",
            });

        if (profile.profileImageId) {
            await cloudinary.uploader.destroy(profile.profileImageId);
        }

        if (name) profile.name = name;
        if (bio) profile.bio = bio;

        if (!profile)
            return res.status(404).json({
                success: false,
                msg: "Profile not found",
            });

        if (typeof media == "string" && media.startsWith("data:image")) {
            try {
                const uploadRes = await uploadToCloudinary(media, "image");
                if (uploadRes.success === true) {
                    profile.profileImage = uploadRes.secure_url;
                    profile.profileImageId = uploadRes.public_id;
                }
            } catch (error) {
                console.log("Error uploading image", error.message);
                return res.status(400).json({
                    success: false,
                    msg: "Error uploading your image",
                });
            }
        }

        await profile.save();

        return res.status(200).json({
            success: true,
            msg: "Profile updated successfully",
            profile,
        });
    } catch (error) {
        console.error("Error in update profile controller", error.message);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
};
