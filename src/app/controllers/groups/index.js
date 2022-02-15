import {
    v4 as uuid_v4
} from "uuid"
import {
    AppConfig
} from "../../../config"
import {
    PAGINATE_MD
} from "../../../constants/Pagination"
import {
    ACTIVATION_EMAIL
} from "../../../constants/Service"
import Controller from "../../../libraries/controller"
import {
    send
} from "../../../services/mail/mail-service"
import {
    GroupInvitationModel
} from "../../models"
import GroupMembersModel from "../../models/group/members"
import GroupRepository from "../../repositories/groups"
import {
    PrivateGroupTransformer,
    PublicGroupTransformer
} from "../../transformers/group"


export default class GroupController extends Controller {
    /**
     * 
     * List all groups on the platform 
     * * Requires super_admin permission
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next
     * @returns 
     */
    async index(req, res, next) {
        try {
            const groups = await new GroupRepository()
                .setRelated({
                    members: true,
                    owner: true
                })
                .setWhere({
                    is_deleted: false,
                })
                .setTransformer(new PrivateGroupTransformer())
                .paginate(PAGINATE_MD, req.query.page)

            return this.sendResponse(res, groups)
        } catch (e) {
            next(e)
        }
    }

    /**
     * 
     * Performs a public search of groups on the system only public groups 
     * are searchable
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next
     * @returns 
     */
    async search(req, res, next) {
        try {
            const {
                search
            } = req.body

            const groups = await new GroupRepository()
                .setWhere({
                    is_deleted: false,
                    is_public: true
                })
                .setTransformer(new PublicGroupTransformer())
                .paginate(PAGINATE_MD, req.query.page)
            return this.sendResponse(res, groups)

        } catch (e) {
            next(e)
        }
    }
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next
     * @returns 
     */
    async show(req, res, next) {
        try {
            const group = await new GroupRepository()
                .setTransformer(GroupTransformer)
                .find(req.params.groupId)
            return this.sendResponse(res, group)
        } catch (e) {
            next(e)
        }
    }
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next
     * @returns 
     */
    async delete(req, res, next) {
        try {

        } catch (e) {
            console.error(e)
            next(e)
        }
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next
     * @returns 
     */
    async joinGroup(req, res, next) {
        try {
            const invitation = req.invitation

            new GroupMembersModel().query().insert({
                group_id: invitation.group_id,
                account_id: req.user.id,
                savings: group.savings_amount
            })
            this.sendResponse(res, null, "Group joined")

        } catch (e) {
            next(e)
        }
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     */
    async inviteMember(req, res, next) {
        try {
            const {
                email
            } = req.body
            const group = await new GroupRepository().find(req.params.groupId)
            const invitation = await GroupInvitationModel
                .generateInvitation(
                    req.user.id,
                    group.id,
                    email
                )
            await send(ACTIVATION_EMAIL, invitation)
            const msg = AppConfig.debug ? invitation.token : "Invitation sent"
            this.sendResponse(res, null, msg)

        } catch (error) {
            next(error)
        }
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next
     * @returns 
     */
    async removeMember(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next
     * @returns 
     */
    async create(req, res, next) {
        try {
            const {
                name,
                created_by,
                description,
                savings_amount,
                maximum_member,
                is_public
            } = req.body
            const group = await new GroupRepository()
                .query()
                .insertAndFetch({
                    name,
                    uuid: uuid_v4(),
                    created_by,
                    owner_id: req.user.id,
                    description,
                    maximum_member,
                    savings_amount,
                    is_public
                }).withGraphFetched('[owner, members]')

            await GroupMembersModel.query().insert({
                group_id: group.id,
                account_id: req.user.id,
                savings: group.savings_amount
            })
            
            this.sendResponse(res, group)
        } catch (error) {
            next(error)
        }
    }

    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next
     * @returns 
     */
    async update(req, res, next) {
        try {
            const response = await new GroupRepository()
                .setTransformer(OrganizationTransformer)
                .update(req.body, req.params.organizationId)

            return this.sendResponse(res, response)
        } catch (e) {
            next(e)
        }
    }
}