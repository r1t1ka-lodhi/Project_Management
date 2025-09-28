import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import jwt from "jsonwebtoken";

// Middleware to verify JWT token

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError("No token provided", 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?._id).select(
            "-password -refreshToken -fullName -emailVerificationToken -emailVerificationTokenExpiration"
        );
        if (!user) {
            throw new ApiError("Invalid access token", 401);
        }
        req.user = user;
        next();
    } catch (error) {
        return next(new ApiError("Invalid access token", 401));
    }
});