import { Router } from "express";
import { registerUser, login } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validators.middlewares.js";
import { userRegisterValidation, loginValidation } from "../validators/index.js";
const router = Router();

router.route("/register").post(userRegisterValidation(), validate, registerUser);
router.route("/login").post(loginValidation(), validate, login);

export default router;