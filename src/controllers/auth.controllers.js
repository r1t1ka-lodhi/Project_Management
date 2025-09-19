;
import {User} from '../models/user.models.js';
import {emailVerificationMailGenContent,sendMail} from '../utils/mail.js';
import {ApiResponse} from '../utils/api-response.js';
import {ApiError} from '../utils/api-error.js';
import {asyncHandler} from '../utils/async-handler.js';

const generateAccessAndRefreshTokens = async(userID) => {
    try {
        const user = await User.findById(userID);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500,"something went wrong while validating token" )
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const{email, username, password, role}=req.body
    const exsist=await User.findOne({
        $or:[{username},{email}]

    })

    if(exsist){
        throw new ApiError('User already exists', 409);
    }

    const user = await User.create({email, username, password, isEmailVerified :false})

    const {unhashedToken, hashedToken, expiration} = user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiration = expiration;

    await user.save({validateBeforeSave: false});

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

    if(!createdUser){
        throw new ApiError('Something went wrong while registering the user', 404);

    }

    return res
        .status(201)
        .json({
            ApiResponse:new ApiResponse(
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
    
    const user= await User.findOne({ email });
    
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
                200,{
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )


});


export { registerUser, login };