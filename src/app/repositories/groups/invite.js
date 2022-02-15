import BaseRepository from "./../../../libraries/Repository"
import { GroupInvitationModel } from "../../models"

class AccountInvitationRepository extends BaseRepository {
    constructor(props) {
        super(props)
    }

    model() {
        return GroupInvitationModel
    }
}

export default AccountInvitationRepository
