import "core-js/stable";
import "regenerator-runtime/runtime";

import {
    normalizePort,
    onServerError,
    onServerListening,
} from "./helpers/core.helper"

import { AppConfig } from "./config"
import ExpressApplication from "./bootstrap/app"
import { createServer } from "http"

ExpressApplication.make().then(
    ({ app, db }) => {
        let port = process.env.PORT || AppConfig.port
        port = normalizePort(port)
        app.set("port", port)

        const server = createServer(app)
        server.listen(port)
        server.on("listening", onServerListening.bind(this, server))
        server.on("error", onServerError)

        process.on("unhandledRejection", (reason, p) => {
            console.error("Unhandled Rejection at:", p, "reason:", reason)
        })

        process.on("SIGINT", () => {
            console.log("Closing db connection")
            try {
                db.destroy()
            } catch (error) {
                console.log(e.code)
            } finally {
                process.exit(0)
            }
        })

    }).catch(error => {
        console.error(error)
    })