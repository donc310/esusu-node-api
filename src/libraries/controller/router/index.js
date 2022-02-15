import * as Controllers            from "./../../../app/controllers"

import { Router as ExpressRouter } from "express"

export default class Router {
    constructor() {
        this.router = ExpressRouter()
    }

    get(path, ...actions) {
        this.router.get(path, ...this._resolveController(actions))
    }

    post(path, ...actions) {
        this.router.post(path, ...this._resolveController(actions))
    }

    patch(path, ...actions) {
        this.router.patch(path, ...this._resolveController(actions))
    }

    delete(path, ...actions) {
        this.router.delete(path, ...this._resolveController(actions))
    }

    put(path, ...actions){
        this.router.put(path, ...this._resolveController(actions))
    }

    export() {
        return this.router
    }

    _resolveController(actions) {
        const lastIndex = actions.length - 1
        const action = actions[lastIndex]

        const [controllerName, methodName] = action.split("@")
        const controller = new Controllers[controllerName]

        actions[lastIndex] = typeof action === "string" ? controller[methodName].bind(controller) : action

        return actions
    }
}


