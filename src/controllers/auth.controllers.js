;
import { User } from '../models/user.models.js';
import { emailVerificationMailGenContent, forgotPasswordMailGenContent, sendMail } from '../utils/mail.js';
import { ApiResponse } from '../utils/api-response.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async-handler.js';

import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const generateAccessAndRefreshTokens = async (userID) => {
    try {
        const user = await User.findById(userID);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "something went wrong while validating token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
    const exsist = await User.findOne({
        $or: [{ username }, { email }]

    })

    if (exsist) {
        throw new ApiError('User already exists', 409);
    }

    const user = await User.create({ email, username, password, isEmailVerified: false })

    const { unhashedToken, hashedToken, expiration } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiration = expiration;

    await user.save({ validateBeforeSave: false });

    await sendMail({
        email: user?.email,
        subject: "Email Verification",
        mailgenContent: emailVerificationMailGenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
        ),
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -fullName -emailVerificationToken -emailVerificationTokenExpiration"
    );

    if (!createdUser) {
        throw new ApiError('Something went wrong while registering the user', 404);

    }

    return res
        .status(201)
        .json({
            ApiResponse: new ApiResponse(
                200,
                {
                    user: createdUser
                },
                "User registered successfully and verification email send to your email"
            )
        });

});

const login = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;
    if (!email) {
        throw new ApiError(400, "Email or username is required to login");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(400, "User not found with this email");
    }
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -fullName -emailVerificationToken -emailVerificationTokenExpiration"
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200, {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
                "User logged in successfully"
            )
        )


});

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized - User ID missing");
    }
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: { refreshToken: "", }
        },
        { new: true, },

    );

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            ApiResponse: new ApiResponse(
                200,
                null,
                "User logged out successfully"
            )
        });
});

const getcurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json({
        ApiResponse: new ApiResponse(
            200,
            req.user,
            "current user fetched successfully"
        )
    })
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { verificationToken } = req.params;
    if (!verificationToken) {
        throw new ApiError(400, "Verification token is required");
    }

    const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationTokenExpiration: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired verification token");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiration = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
        ApiResponse: new ApiResponse(200, { isEmailVerified: true }, "Email verified successfully")
    });
});

const resendEmailVerification = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);
    if (!user) {
        throw new ApiError(404, "User not exsist");
    }
    if (user.isEmailVerified) {
        throw new ApiError(409, "Email already verified");
    }


    const { unhashedToken, hashedToken, expiration } = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiration = expiration;

    await user.save({ validateBeforeSave: false });

    await sendMail({
        email: user?.email,
        subject: "Email Verification",
        mailgenContent: emailVerificationMailGenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unhashedToken}`
        ),
    });
    return res.status(200).json({
        ApiResponse: new ApiResponse(200, null, "Verification email resent successfully")
    });

});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
        throw new ApiError(401, "Refresh token is missing");
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decoded) {
            throw new ApiError(403, "Invalid refresh token");
        }

        const user = await User.findById(decoded?._id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        if (user.refreshToken !== refreshToken) {
            throw new ApiError(403, "Refresh token is expired");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };


        const { accessToken, refreshToken: newRefreshToken } = user.generateAccessAndRefreshToken();
        user.refreshToken = newRefreshToken;
        await user.save();
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json({
                ApiResponse: new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully")
            });
    } catch (error) {
        throw new ApiError(403, "Refresh token is expired");
    }
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(400, "Email not foound");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const { unhashedToken, hashedToken, expiration } = user.generateTemporaryToken();
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiration = expiration;
    await user.save({ validateBeforeSave: false });

    await sendMail({
        email: user?.email,
        subject: "Reset Password",
        mailgenContent: forgotPasswordMailGenContent(
            user.username,
            `${process.env.FORGOT_PASSWORD_REDIRECT_URL}?token=${unhashedToken}`
        ),
    });

    return res.status(200).json({
        ApiResponse: new ApiResponse(200, null, "Password reset email sent to your email")
    });
});

const resetForgotPassword = asyncHandler(async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;

    let hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    if (!resetToken || !password) {
        throw new ApiError(400, "Token and password are required");
    }

    const user = await User.findOne({ forgotPasswordToken: hashedToken, forgotPasswordTokenExpiration: { $gt: Date.now() } });
    if (!user) {
        throw new ApiError(404, "Invalid or expired token");
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiration = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
        ApiResponse: new ApiResponse(200, null, "Password reset successfully")
    });
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id).select("+password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(400, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
        ApiResponse: new ApiResponse(200, null, "Password changed successfully")
    });

})

export {
    login,
    logoutUser,
    getcurrentUser,
    verifyEmail,
    resendEmailVerification,
    refreshAccessToken,
    registerUser,
    forgotPasswordRequest,
    resetForgotPassword,
    changeCurrentPassword
};