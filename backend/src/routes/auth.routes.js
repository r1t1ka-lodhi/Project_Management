import { Router } from "express";
import { registerUser, login, logoutUser, verifyEmail, refreshAccessToken, forgotPasswordRequest, resetForgotPassword, changeCurrentPassword, getcurrentUser, resendEmailVerification } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validators.middlewares.js";
import { userRegisterValidation, loginValidation, userForgotPasswordValidation, userChangePasswordValidation } from "../validators/index.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(userRegisterValidation(), validate, registerUser);
router.route("/login").post(loginValidation(), validate, login);
router.route("/verify-email/:verificationToken").get(verifyEmail);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forgot-password").post(userForgotPasswordValidation(), validate, forgotPasswordRequest);
router.route("/reset-password/:resetToken").post(
    userForgotPasswordValidation(),
    validate,
    resetForgotPassword
);

//secured route
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").post(verifyJWT, getcurrentUser);
router.route("/change-password").post(verifyJWT, userChangePasswordValidation(), validate, changeCurrentPassword);
router.route("/resend-email-verification").post(verifyJWT, resendEmailVerification);


export default router;