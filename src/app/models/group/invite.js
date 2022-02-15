import BaseModel from "../../../libraries/Repository/model"
import { DateTime } from 'luxon';
import { Model } from "objection"
import { GROUP_INVITATION_TABLE, ACCOUNT_TABLE } from "../../../constants/DBTables"
import crypto from "crypto"

export default class GroupInvitationModel extends BaseModel {
    static get tableName() {
        return GROUP_INVITATION_TABLE
    }
    static get relationMappings() {
        const Users = require("../account/index").default
        const relationships = {
            inviter: {
                relation: Model.BelongsToOneRelation,
                modelClass: Users,
                join: {
                    from: `${GROUP_INVITATION_TABLE}.account_id`,
                    to: `${ACCOUNT_TABLE}.id`
                }
            }
        }
        return relationships
    }
    /**
     * 
     * @param {String} token 
     * @returns {Promise<Boolean>}
     */
    async verifyInvitation(email) {
        const isExpired = new DateTime(this.expires) > DateTime.now()
        const emailMatch = email === this.email
        if (isExpired || !emailMatch) return false
        return true
    }
    /**
     * 
     * @param {*} account_id 
     * @param {*} group_id 
     * @param {*} invitee_email 
     * @returns 
     */
    static async generateInvitation(account_id, group_id, invitee_email) {
        const invite = {
            account_id,
            group_id,
            token: crypto.randomBytes(32).toString('hex'),
            email: invitee_email,
            expires: DateTime.now().plus({ days: 3 }).toISO()
        }
        const invitation = await GroupInvitationModel.query().insertAndFetch(invite)
        return invitation
    }
}