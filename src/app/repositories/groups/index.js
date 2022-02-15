import BaseRepository from "../../../libraries/Repository"
import { OrganizationModel } from "../../models"

class GroupRepository extends BaseRepository {
    constructor(props) {
        super(props)
    }
    model() {
        return OrganizationModel
    }
    
}

export default GroupRepository