import bcrypt from "bcryptjs";

import Auth from "../models/auth.model.js";
import { genAuthToken } from "../utils/genAuthToken.utils.js";
import Profile from "../models/profile.model.js";

export const getAuthUser = async (req, res) => {
    try {
        const authUserId = req.user.id;

        const authUser = await Auth.findById(authUserId);

        if (!authUser)
            return res.status(404).json({
                success: false,
                msg: "User not found - Unauthorized",
            });

        return res.status(200).json({
            success: true,
            authUser,
        });
    } catch (error) {
        console.log("Error in get auth user controller", error.message);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const userId = req.user.id;
        const users = await Auth.find({
            _id: {
                $ne: userId,
            },
        });
        if (!users)
            return res.status(404).json({
                success: false,
                msg: "Users not found",
            });

        const profiles = await Profile.find({
            userId: {
                $ne: userId,
            },
        });

        return res.status(200).json({
            success: true,
            users,
            profiles,
        });
    } catch (error) {
        console.log("Error in get users controller", error.message);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
};

export const Register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password)
            return res.status(400).json({
                success: false,
                msg: "All fields are required",
            });

        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(email))
            return res.status(400).json({
                success: false,
                msg: "Invalid email address",
            });

        if (password.length < 6)
            return res.status(400).json({
                success: false,
                msg: "Password should be atleast 6 or more characters",
            });

        const existingUser = await Auth.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser)
            return res.status(400).json({
                success: false,
                msg: "email or username may already exists - please try with a different email or username",
            });

        const newUser = new Auth({
            email,
            username,
            password,
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            msg: "User registered successfully",
            newUser,
        });
    } catch (error) {
        console.log("Error in register controller", error.message);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
};

export const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({
                success: false,
                msg: "All fields are required",
            });

        const foundUser = await Auth.findOne({ email });

        const comparedPass = await bcrypt.compare(password, foundUser.password);

        if (!comparedPass)
            return res.status(400).json({
                success: false,
                msg: "Wrong credentials try again - incorrect email or password",
            });

        if (!foundUser)
            return res.status(404).json({
                success: false,
                msg: "User not found - try again or register",
            });

        genAuthToken(foundUser._id, res);

        const { password: _, ...foundUserwithoutPassword } =
            foundUser.toObject();

        return res.status(200).json({
            success: true,
            msg: "Logged in successfully - Welcome",
            foundUserwithoutPassword,
        });
    } catch (error) {
        console.log("Error in log in controller", error.message);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
};

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({
            success: true,
            msg: "Logged out successfully",
        });
    } catch (error) {
        console.log("Error in log out controller");
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
};
