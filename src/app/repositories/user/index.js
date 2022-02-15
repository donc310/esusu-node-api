import BaseRepository from "../../../libraries/Repository"
import { UserModel } from "../../models"

class UserRepository extends BaseRepository {
    constructor(props) {
        super(props)
    }

    model() {
        return UserModel
    }
}

export default UserRepository
