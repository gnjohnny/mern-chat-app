import jwt from "jsonwebtoken";

export const checkAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token)
            return res.status(401).json({
                success: false,
                msg: "User not authenticated - no token provided",
            });

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedUser)
            return res.status(401).json({
                success: false,
                msg: "User not found - invalid token",
            });

        req.user = decodedUser;

        next();
    } catch (error) {
        console.log("Error in check auth middleware", error.message);
        return res.status(500).json({
            success: false,
            msg: "Internal server error",
        });
    }
};
