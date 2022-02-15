import {
    check
} from "express-validator"
import {
    ModelNotFoundException
} from "../../libraries/Repository/exceptions"
import {
    UserRepository
} from "../repositories"


export default {
    login: [
        check("username").isString().withMessage("Username is required."),

        check("password").isString().withMessage("Password is required."),
    ],

    signup: [
        check("email").
            isString().withMessage("Email is required.").
            normalizeEmail().isEmail().withMessage("Invalid email format").
            custom(async email => {
                try {
                    await new UserRepository().findByColumn("email", email)
                } catch (e) {
                    if (e instanceof ModelNotFoundException) return true;
                    console.error(e)
                    throw new Error("Error validating input values");
                }
                throw new Error("Email already exists.")
            }),

        check("username")
            .stripLow()
            .trim()
            .isString().withMessage("Username is required")
            .isLength({
                min: 3
            }).withMessage("Username should be more than 3 characters long.")
            .custom(async username => {
                try {
                    await new UserRepository().findByColumn("username", username)
                } catch (error) {
                    if (error instanceof ModelNotFoundException) return true;
                    console.error(error)
                    throw new Error("Error validating input values");
                }

                throw new Error("Username already exists.")
            }),
        check("password").
            isString().withMessage("Password is required").
            isLength({
                min: 6
            }).withMessage("Password should be greater than 6 characters long.")
    ],

    changePassword: [
        check("token")
            .isString().withMessage("Token is required")
            .isLength({
                min: 32
            })
            .withMessage("Invalid token")
            .custom(async (token, { req }) => {

            }),

        check("password").
            isString().withMessage("Password is required").
            isLength({
                min: 6
            }).withMessage("Password should be greater than 6 characters long."),

        check("confirmPassword").
            isString().withMessage("Password is required").
            custom(async (password, {
                req
            }) => {
                if (password === req.body.password) {
                    return true
                }

                throw new Error("Password confirmation does not match password")
            }),
    ],

    changePasswordRequest: [
        check("email").
            isString().withMessage("Email is required.").
            normalizeEmail().isEmail().withMessage("Invalid email format").
            custom(async (email, {
                req
            }) => {
                try {
                    const account = await new UserRepository().findByColumn("email", email)
                    req.resetAccount = account
                } catch (e) {
                    if (e instanceof ModelNotFoundException) throw new Error("Invalid Account");
                    console.error(e)
                }
                return false
            })
    ],
}