import {
    FormValidations,
    auth,
    grantAccess,
} from "../app/middleware"
import { checkOwnership } from "../app/middleware/permission"
import Router from "../libraries/controller/router"
import { systemRoles } from "../app/permissions"
import { tracker } from "../app/middleware/action_tracker"
import validations from "../app/validations/group.validation"

const GroupRoute = new Router()

GroupRoute.get("/",
    [
        auth.handle,
        grantAccess(systemRoles, 'readAny', 'group'),

    ],
    "GroupController@index"
)

GroupRoute.get("/search",
    [
        auth.handle,
        FormValidations,
    ],
    "GroupController@search"
)

GroupRoute.get("/:groupId(\\d+)",
    [
        auth.handle,
        grantAccess(systemRoles, 'readAny', 'group'),

    ],
    "GroupController@show"
)

GroupRoute.get("/:userId(\\d+)/groups",
    [
        auth.handle,
        grantAccess(systemRoles, 'readAny', 'group'),
    ],
    "GroupController@show"
)

GroupRoute.delete("/:groupId(\\d+)",
    [
        auth.handle,
        grantAccess(systemRoles, 'delete', 'group'),
        tracker('deleted_by'),
    ],
    'GroupController@delete'
)

GroupRoute.post("/",
    [
        auth.handle,
        grantAccess(systemRoles, 'createOwn', 'group'),
        validations.create,
        FormValidations,
        tracker('created_by'),
        tracker('owner_id')
    ],
    "GroupController@create"
)

GroupRoute.post("/:groupId(\\d+)/invite",
    [
        auth.handle,
        grantAccess(systemRoles, 'updateOwn', 'group'),
        validations.invite,
        FormValidations,
    ],
    "GroupController@inviteMember"
)

GroupRoute.patch("/:groupId(\\d+)",
    [
        auth.handle,
        grantAccess(systemRoles, 'updateOwn', 'group'),
        tracker('updated_by'),
    ],
    'GroupController@update'
)

export default GroupRoute.export()
