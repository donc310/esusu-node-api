/**
 * @typedef {import('objection').Model} Model
 * @typedef {import('passport-jwt').VerifiedCallback} JwtDone
 */

import {
    ACCOUNT_TABLE,
    GROUP_ACCOUNT_TABLE,
    GROUP_TABLE,
} from "../../../constants/DBTables"

import {
    SYSTEM_SCOPE
} from "../../../constants/UserRoles"

import BaseModel from "../../../libraries/Repository/model"
import {
    Model
} from "objection"
import Password from "../../../libraries/Repository/model/plugins/Password"
import SoftDelete from "objection-soft-delete"
import UserAccessors from "./Accessors"
import {
    AuthConfig
} from "../../../config"
import jwt from "jsonwebtoken"


@UserAccessors
@Password
@SoftDelete({
    columnName: 'is_deleted'
})
export default class User extends BaseModel {
    static get tableName() {
        return ACCOUNT_TABLE
    }
    static get relationMappings() {
        const GroupModel = require("../group").default
        return {
            // Organizations for which  the user is a member
            memberships: {
                relation: Model.ManyToManyRelation,
                modelClass: GroupModel,
                join: {
                    from: `${ACCOUNT_TABLE}.id`,
                    through: {
                        from: `${GROUP_ACCOUNT_TABLE}.account_id`,
                        to: `${GROUP_ACCOUNT_TABLE}.group_id`
                    },
                    to: `${GROUP_TABLE}.id`
                }
            },

            // Organizations for which  the user owns
            groups: {
                relation: Model.HasManyRelation,
                modelClass: GroupModel,
                join: {
                    to: `${GROUP_TABLE}.owner_id`,
                    from: `${ACCOUNT_TABLE}.id`
                }
            }
        }
    }
    /**
     * 
     * @param {Model} authModel 
     * @param {String} username 
     * @param {String} password 
     * @param {Function} done 
     * @returns 
     */
    async authenticate(authModel, username, password, done) {
        const user = await authModel.query().findOne({
            "username": username
        })
        if (!user) return done(null, null, "Invalid login.");
        const isPasswordValid = await user.matchPassword(password)
        if (!isPasswordValid) return done(null, null, "Invalid login.");
        return done(null, user, "Login success.")
    }

    /**
     * 
     * @param {Model} authModel 
     * @param {Object} jwtPayload
     * @param {JwtDone} done 
     * @returns 
     */
    async authenticateJwt(authModel, jwtPayload, done) {
        const user = await authModel.query().findById(jwtPayload.id)

        if (!user) {
            return done("UnAuthenticated")
        }

        return done(null, user, jwtPayload)
    }

    /**
     * 
     * @returns 
     */
    async generateToken() {
        const groups = await this.$relatedQuery('groups')
            .where("is_deleted", false)
            .select("uuid")

        return jwt.sign({
            id: this.id,
            email: this.email,
            role: this.role,
            scope: SYSTEM_SCOPE,
            organizations: groups.map(x => x.uuid).join('|')
        }, AuthConfig.jwtSecret, {
            expiresIn: AuthConfig.tokenExpiration
        })
    }
}