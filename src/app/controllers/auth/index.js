/**
 * @typedef {import('express').Response} Response
 * @typedef {import('express').Request} Request
 * @typedef {import('express').NextFunction} Next
 */

import passport from "passport";
import {
    AppConfig
} from "../../../config";
import {
    HTTP_BAD_REQUEST,
    HTTP_NOT_FOUND
} from "../../../constants/HTTPCode";
import {
    PASSWORD_RESET_EMAIL
} from "../../../constants/Service";
import {
    USER
} from "../../../constants/UserRoles";
import Controller from "../../../libraries/controller";
import {
    send
} from "../../../services/mail/mail-service";
import {
    UnAuthorizedException
} from "../../exceptions";
import {
    PasswordResetModel
} from "../../models";
import {
    UserRepository
} from "../../repositories";
import {
    UserTransformer
} from "../../transformers";

export default class AuthController extends Controller {
    async loadProfile(user) {
        const token = await user.generateToken();

        const groups = await user
            .$relatedQuery("groups")
            .where("is_deleted", false)
            .select("name", "uuid");

        user = UserTransformer.transform(user);
        user.token = token;
        user.groups = groups;
        return user;
    }
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @param {Next} next
     */
    async login(req, res, next) {
        passport.authenticate(
            "local", {
            session: false
        },
            async (err, user, message) => {
                if (!user) return next(new UnAuthorizedException(message));
                user = await this.loadProfile(user);
                this.sendResponse(res, user, message, 200, "user");
            }
        )(req, res);
    }
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @param {Next} next
     */
    async profile(req, res, next) {
        try {
            const user = await this.loadProfile(req.user);
            return this.sendResponse(res, user, "", 200, "user");
        } catch (error) {
            next(error);
        }
    }
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @param {Next} next
     */
    async signUp(req, res, next) {
        try {
            const {
                email,
                username,
                password,
                firstName: first_name,
                lastName: last_name,
            } = req.body;

            await new UserRepository()
                .setTransformer(UserTransformer)
                .create({
                    email,
                    username,
                    password,
                    role: USER,
                    full_name: {
                        first_name,
                        last_name
                    },
                });

            this.sendResponse(res, null, "Account created");
        } catch (error) {
            next(error);
        }
    }
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @param {Next} next
     */
    async logout(req, res, next) { }
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @param {Next} next
     */
    async resetPassword(req, res, next) {
        try {
            const { token, password, } = req.body;
            const resetRequest = await PasswordResetModel.query()
                .withGraphFetched({
                    owner: true
                })
                .findOne("token", token);

            if (!resetRequest) {
                return this.sendError(
                    res,
                    "Invalid password reset request",
                    HTTP_NOT_FOUND
                );
            }
            const isValid = resetRequest.verifyToken(token);
            if (!isValid) {
                return this.sendError(
                    res,
                    "Invalid/Expired password reset request",
                    HTTP_BAD_REQUEST
                );
            }

            await resetRequest.$relatedQuery("owner").patch({
                password
            });
            await resetRequest.$query().delete();

            return this.sendResponse(res, null, "Password reset");
        } catch (error) {
            next(error);
        }
    }
    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async requestPasswordChange(req, res, next) {
        try {
            const request = await PasswordResetModel.generateResetRequest(req.resetAccount.id)
            await send(PASSWORD_RESET_EMAIL, {
                email: req.resetAccount.email,
                name: req.resetAccount.username,
                token: request.token,
                expires: request.expires
            })
            const msg = AppConfig.debug ? request.token : "Reset email sent"
            this.sendResponse(res, null, msg)
        } catch (error) {
            next(error)
        }
    }
}