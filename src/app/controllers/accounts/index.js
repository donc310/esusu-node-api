/**
 * @typedef {import('express').Response} Response
 * @typedef {import('express').Request} Request
 * @typedef {import('express').NextFunction} Next
 */

import Controller from "../../../libraries/controller"
import {
    PAGINATE_MD
} from "../../../constants/Pagination"
import {
    UserRepository
} from "../../repositories"
import {
    UserTransformer
} from "../../transformers"
import {
    matchedData
} from "express-validator"

import {
    USER
} from "../../../constants/UserRoles"

export default class AccountController extends Controller {
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     */
    async index(req, res, next) {
        try {
            const users = await new UserRepository()
                .setWhere({
                    is_deleted: false
                })
                .setTransformer(UserTransformer)
                .paginate(PAGINATE_MD, req.query.page)
            return this.sendResponse(res, users)
        } catch (error) {
            next(error)
        }
    }
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     */
    async show(req, res, next) {
        try {
            const user = await new UserRepository()
                .setTransformer(UserTransformer)
                .find(req.params.userId)
            return this.sendResponse(res, user)
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
    async create(req, res, next) {
        try {
            const {
                email,
                username,
                password
            } = req.body
            const user = await new UserRepository()
                .setTransformer(UserTransformer)
                .create({
                    email,
                    username,
                    password,
                    role: USER
                });
            this.sendResponse(res, {user})
        } catch (error) {
            next(error)
        }
    }
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     */
    async update(req, res, next) {
        try {
            const user = await new UserRepository()
                .setTransformer(UserTransformer)
                .update(matchedData(req), req.params.userId)

            return this.sendResponse(res, user)
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
    async delete(req, res, next) {
        try {
            await new UserRepository()
                .delete(req.params.userId)
            return this.sendResponse(res, null, "User deleted successfully.")
        } catch (e) {
            next(e)
        }
    }
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    async changePassword(req, res, next) {
        const {
            password
        } = matchedData(req)

        try {
            await new UserRepository()
                .update({
                    password
                }, req.params.userId)

            return this.sendResponse(res, null, "Password changed successfully.")
        } catch (e) {
            next(e)
        }
    }
}