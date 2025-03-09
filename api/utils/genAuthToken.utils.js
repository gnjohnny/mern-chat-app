import jwt from "jsonwebtoken";

export const genAuthToken = (id, res) => {
    try {
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            signed: false,
            secured: process.env.NODE_ENV || "development",
            httpOnly: true,
        });

        return token;
    } catch (error) {
        console.log("Error generating a token", error.message);
    }
};
