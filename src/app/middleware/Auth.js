/**
* @typedef {import('express').Response} Response
* @typedef {import('express').Request} Request
* @typedef {import('express').NextFunction} Next
*/

import passport from "passport";
import { UnAuthorizedException } from "../exceptions";

class Auth {
    /**
     * 
     * @param {Request} req 
     * @param {Response} res 
     * @param {Next} next 
     */
    handle(req, res, next) {
        passport.authenticate("jwt", { session: false, }, (err, user, info) => {
            try {
                if (!user) return next(new UnAuthorizedException(info.message));
                req.user = user
                next()
            } catch (error) {
                next(error)
            }
        })(req, res, next)
    }
}

export default  new Auth()
