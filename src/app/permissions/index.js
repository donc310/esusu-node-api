/**
* @typedef {import('express').Response} Response
* @typedef {import('express').Request} Request
* @typedef {import('express').NextFunction} Next
* @typedef {import('accesscontrol').AccessControl} Ac
*/

import {
    SUPER_ADMIN,
    USER
} from "../../constants/UserRoles"

import { AccessControl } from "accesscontrol";


export const systemRoles = (function () {
    const ac = new AccessControl();

    ac.grant(USER)
        .resource(['account', 'group']).readOwn().createOwn().updateOwn().deleteOwn()


    ac.grant(SUPER_ADMIN)
        .resource(['group', "account"]).readAny().readAny().readAny().readAny()

    ac.lock()
    return ac;
})();