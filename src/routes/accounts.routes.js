import {
    FormValidations,
    auth,
    grantAccess
} from "../app/middleware"

import { checkOwnership } from "../app/middleware/permission"
import { systemRoles } from "../app/permissions"
import Router from "../libraries/controller/router"
import UsersValidations from "../app/validations/users.validations"

const AccountRouter = new Router()

AccountRouter.get("/",
    [
        auth.handle,
        grantAccess(systemRoles, 'read', 'accounts'),
    ],
    "AccountController@index"
)

AccountRouter.get("/:userId",
    [
        auth.handle,
        checkOwnership(systemRoles, 'read', 'accounts')
    ],
    "AccountController@show"
)

AccountRouter.post("/",
    [
        auth.handle,
        grantAccess(systemRoles, 'create', 'accounts'),
        UsersValidations.create,
        FormValidations
    ],
    "AccountController@create"
)

AccountRouter.post("/invite",
    [
        auth.handle,
        grantAccess(systemRoles, 'create', 'invitations'),
        UsersValidations.invite,
        FormValidations
    ],
    "AccountController@inviteUser"
)

AccountRouter.patch("/:userId",
    [
        auth.handle,
        checkOwnership(systemRoles, 'update', 'accounts'),
        UsersValidations.update,
        FormValidations
    ],
    "AccountController@update"
)

AccountRouter.post("/:userId/change-password",
    [
        auth.handle,
        UsersValidations.passwordChange,
        FormValidations
    ], "AccountController@changePassword"
)

AccountRouter.delete("/:userId",
    [
        auth.handle,
        checkOwnership(systemRoles, 'delete', 'accounts')
    ],
    "AccountController@delete"
)

export default AccountRouter.export()
