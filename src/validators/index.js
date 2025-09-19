import {body} from 'express-validator';

const userRegisterValidation = () =>{
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is not valid"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLowercase()
            .withMessage("Username must be in lowercase")
            .isLength({min: 3, max: 20})
            .withMessage("Username must be between 3 and 20 characters long"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
            .isLength({min: 6, max: 20})
            .withMessage("Password must be between 6 and 20 characters long"),
        body("fullName")
            .optional()
            .trim()
            .isLength({min: 2, max: 100})
            .withMessage("Full name must be between 2 and 100 characters long")

    ]
}
const loginValidation = () =>{
    return[
        body("email")
            .optional()
            .trim()
            .isEmail()
            .withMessage("Email is not valid"),
        body("username")
            .optional()
            .trim()
            .isLowercase()
            .withMessage("Username must be in lowercase")
            .isLength({min: 3, max: 20})
            .withMessage("Username must be between 3 and 20 characters long"),
        body("password")
            .notEmpty()
            .withMessage("Password is required")
            .trim()
    ]
}
export {userRegisterValidation, loginValidation};