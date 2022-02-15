//import AccountRoutes from "./accounts.routes"
import AuthRoutes from "./auth.routes"
import GroupRoutes from "./group.routes"

/**
* @typedef {import('express').Express} Express
*/

/**
 * @param {Express} app
 */
export default (app) => {
    app.use("/auth", AuthRoutes)
    app.use("/group", GroupRoutes)
    //app.use("/accounts", AccountRoutes)
}
