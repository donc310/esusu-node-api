import BaseModel from "../../../libraries/Repository/model"
import { GROUP_ACCOUNT_TABLE } from "../../../constants/DBTables"

export default class GroupMembersModel extends BaseModel {
    static get tableName() {
        return GROUP_ACCOUNT_TABLE
    }
}