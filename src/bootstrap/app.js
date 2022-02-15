/**
 * @typedef {import("knex").Knex} Knex
*/

import {
    json,
    urlencoded
} from "body-parser";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import knex from 'knex';
import methodOverride from "method-override";
import logger from "morgan";
import {
    Model
} from "objection";
import passport from "passport";
import {
    ExtractJwt,
    Strategy as JWTStrategy
} from "passport-jwt";
import LocalStrategy from "passport-local";
import {
    NotFoundException,
    UnAuthorizedException,
    ValidationException
} from "../app/exceptions";
import {
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
    HTTP_UNAUTHORIZED,
    HTTP_UNPROCESSABLE_ENTITY
} from "../constants/HTTPCode";
import { ModelNotFoundException } from "../libraries/Repository/exceptions";
import routes from "../routes/index.routes";
import {
    AppConfig,
    AuthConfig,
    DBConfig
} from "./../config";




class ExpressApplication {
    constructor() {
        this.app = express()
        this.appDebug = AppConfig.debug
    }

    /**
     * 
     * @param {Knex} connection 
     */
    async setup(connection) {
        //NOTE Order in which handlers are added is very important

        Model.knex(connection)
        this.setupLogger()

        //TODO Implement origin verification
        const corsOptions = {
            origin: '*',
            optionsSuccessStatus: 200
        }
        
        this.app.use(cors())
        this.app.options('*', cors(corsOptions))

        this.app.use(helmet())
        this.app.use(compression())
        this.app.use(json())
        this.app.use(urlencoded({ extended: true }))
        this.app.use(methodOverride("_method"))

        this.setupAuthentication()
        this.setupRouters()
    }

    /**
     * 
     */
    setupLogger() {
        const format = `:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`
        this.app.use(logger(format))
    }
    /**
     * 
     */
    setupRouters() {
        routes(this.app)
        
        this.app.use((req, res, next) => {
            throw new NotFoundException()
        })

        this.app.use((error, req, res, next) => {
            if (error instanceof NotFoundException || error instanceof ModelNotFoundException) {
                return res.status(error.status || HTTP_NOT_FOUND).json({
                    message: error.message,
                })
            }
            if (error instanceof ValidationException) {
                return res.status(error.status || HTTP_UNPROCESSABLE_ENTITY).json({
                    errors: error.errors,
                    message: error.message,
                })
            }
            if (error instanceof UnAuthorizedException) {
                return res.status(error.status || HTTP_UNAUTHORIZED).json({
                    message: error.message,
                })
            }
            return res.status(error.status || HTTP_INTERNAL_SERVER_ERROR).json({
                message: this.appDebug ? error.message : "Server error.",
                errors: this.appDebug ? error : null,
            })
        })
    }

    /**
     * 
     */
    setupAuthentication() {
        this.app.use(passport.initialize({}))

        const authModel = new AuthConfig.authModel()

        passport.use("local", new LocalStrategy({
            usernameField: AuthConfig.request.usernameField,
            passwordField: AuthConfig.request.passwordField,
        }, (username, password, done) => {
            authModel.authenticate(AuthConfig.authModel, username, password, done)
        }))

        passport.use("jwt", new JWTStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: AuthConfig.jwtSecret,
        }, (jwtPayload, done) => {
            authModel.authenticateJwt(AuthConfig.authModel, jwtPayload, done)

        }))
    }

    /**
     * 
     * @returns 
     */
    static async make() {
        const application = new ExpressApplication()
        const connection = knex(DBConfig)
        await application.setup(connection)
        return {
            app: application.app,
            db: connection
        }
    }
}

export default ExpressApplication
