import { Model } from "objection"
import SoftDelete from "objection-soft-delete"
import {
    ACCOUNT_TABLE,
    GROUP_ACCOUNT_TABLE,
    GROUP_TABLE
} from "../../../constants/DBTables"
import BaseModel from "../../../libraries/Repository/model"


@SoftDelete({ columnName: 'is_deleted' })
export default class GroupModel extends BaseModel {
    static get tableName() {
        return GROUP_TABLE
    }
    static get relationMappings() {
        const User = require("../account").default

        return {
            owner: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: `${GROUP_TABLE}.owner_id`,
                    to: `${ACCOUNT_TABLE}.id`
                }
            },
            members: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    to: `${ACCOUNT_TABLE}.id`,
                    through: {
                        to: `${GROUP_ACCOUNT_TABLE}.account_id`,
                        from: `${GROUP_ACCOUNT_TABLE}.group_id`
                    },
                    from: `${GROUP_TABLE}.id`
                }
            }
        }
    }

}