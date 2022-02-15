/**
 * @typedef {import('objection').Model} Model
 * @typedef {import('passport-jwt').VerifiedCallback} JwyDone
 */

import { AuthConfig } from "../../../../config"
import jwt from "jsonwebtoken"

export default function Authenticatable() {
    /**
     * @param {Model} Model
     */
    return (Model) => {
         return class extends Model {
            /**
             * 
             * @param {Model} authModel 
             * @param {String} username 
             * @param {String} password 
             * @param {Function} done 
             * @returns 
             */
            async authenticate(authModel, username, password, done) {
                const user = await authModel.query().findOne({ "username": username })
                if (!user || !user.matchPassword(password)) {
                    return done(null, null, "Invalid login.")
                }

                return done(null, user, "Login success.")
            }

            /**
             * 
             * @param {Model} authModel 
             * @param {Object} jwtPayload
             * @param {JwyDone} done 
             * @returns 
             */
            async authenticateJwt(authModel,jwtPayload, done) {
                const user = await authModel.query().findById(jwtPayload.id)

                if (!user) {
                    return done("UnAuthenticated")
                }

                return done(null, user , jwtPayload)
            }

            generateToken() {
                return jwt.sign({
                    id: this.id,
                    email: this.email,
                    role: this.role
                }, AuthConfig.jwtSecret,{expiresIn:AuthConfig.tokenExpiration})
            }
        }
    }
}