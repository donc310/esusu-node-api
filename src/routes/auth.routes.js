import AuthValidations from "../app/validations/auth.validations"
import { FormValidations, auth } from "../app/middleware"
import Router from "../libraries/controller/router"

const AuthRouter = new Router()

AuthRouter.post("/login",
    [
        AuthValidations.login,
        FormValidations,
    ],
    "AuthController@login"
)

AuthRouter.post("/profile",
    [
        auth.handle
    ],
    "AuthController@profile"
)

AuthRouter.post("/signup",
    [
        AuthValidations.signup,
        FormValidations
    ],
    "AuthController@signUp"
)

AuthRouter.post("/logout",
    [
        AuthValidations.login,
        FormValidations,
    ],
    "AuthController@logout"
)

AuthRouter.post("/reset-password",
    [
        AuthValidations.changePassword,
        FormValidations
    ],
    "AuthController@resetPassword"
)

AuthRouter.post("/request-password-change",
    [
        AuthValidations.changePasswordRequest,
        FormValidations
    ],
    "AuthController@requestPasswordChange"
)

export default AuthRouter.export()
