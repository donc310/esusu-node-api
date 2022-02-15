import crypto from "crypto";
import {
    DateTime
} from 'luxon';
import {
    Model
} from "objection";
import {
    ACCOUNT_TABLE,
    PASSWORD_RESET_TABLE
} from "../../../constants/DBTables";
import BaseModel from "../../../libraries/Repository/model";




export default class PasswordResetModel extends BaseModel {
    /**
     * 
     */
    static get tableName() {
        return PASSWORD_RESET_TABLE
    }
    /**
     * 
     */
    static get relationMappings() {
        const Users = require("./index").default
        const relationships = {
            owner: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: `${PASSWORD_RESET_TABLE}.account_id`,
                    to: `${ACCOUNT_TABLE}.id`
                }
            }
        }
        return relationships
    }
    /**
     * 
     * @param {String} token 
     * @returns {Boolean}
     */
    verifyToken(token) {
        return DateTime.fromJSDate(this.expires) > DateTime.now()
    }
    /**
     * 
     * @param {Number} account_id 
     * @returns 
     */
    static async generateResetRequest(accountId) {
        const resetInfo = {
            account_id: accountId,
            token: crypto.randomBytes(32).toString('hex'),
            expires: DateTime.now().plus({
                hour: 12
            }).toISO()
        }
        const resetRequest = await PasswordResetModel.query().insertAndFetch(resetInfo)
        return resetRequest
    }
}