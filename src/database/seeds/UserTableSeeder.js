/**
* @typedef {import('knex')} knex
*/

import "./../factories/UserFactory"

import { ACCOUNT_TABLE } from "../../constants/DBTables"
import { SUPER_ADMIN } from "../../constants/UserRoles"
import factory         from "../../libraries/FakerFactories"
import { random }      from "../../helpers/core.helper"

export const seed = async knex => {
    const superAdmin = await knex(ACCOUNT_TABLE).where("email", "systemadmin@localhost.com")

    if (superAdmin.length === 0) {
        await factory("users", 1).create({
            email: "systemadmin@localhost.com",
            username: "admin",
            full_name: {
                first_name: "Super",
                last_name: "Administrator",
            },
            role: SUPER_ADMIN,
        })
    }

    await factory("users", random(1, 2)).create()
}
