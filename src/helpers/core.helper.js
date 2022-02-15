import {
    EnvironmentError
} from "../exceptions"
import path from "path"

export const stage = process.env.NODE_ENV || 'development';

if (stage !== 'production') require('dotenv').config();

export const root_path = (directory = undefined) => path.resolve(__dirname, "../..", directory || "")
export const src_path = (directory) => path.resolve(path.resolve(__dirname, "../"), directory || "")

/**
 * 
 * @param {*} key 
 * @param {*} defaultValue 
 * @param {*} type 
 * @returns {(string|number|boolean)}
 */
export const env = (key, defaultValue, type) => {
    const numberType = (value) => {
        if (typeof value === 'number') return value;
        return parseInt(value.replace(/\s+/g, ''), 10)
    }
    const booleanType = (value) => {
        if (typeof value === 'boolean') return value;
        return ['True', '1', 'Yes', 'yes', 'true'].includes(value)
    }

    const value = process.env[key] || defaultValue
    if (typeof value === "undefined") throw new EnvironmentError(`Environment variable ${key} not set.`);
    if (type === Boolean) return booleanType(value);
    if (type === Number) return numberType(value);
    return value
}

/**
 * 
 * @param {*} port 
 * @returns {String}
 */
export const normalizePort = (port) => {
    port = parseInt(port, 10)

    if (isNaN(port)) {
        throw new Error("Invalid port.")
    }

    if (port <= 0) {
        throw new Error("Invalid port.")
    }

    return port
}
/**
 * 
 * @param {*} server 
 */
export const onServerListening = (server) => {
    const addr = server.address()
    const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`
    console.info(`Server listening on ${bind}`)
}

/**
 * 
 * @param {*} error 
 */
export const onServerError = (error) => {
    if (error.syscall !== "listen") {
        throw error
    }
    const port = error.port
    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port

    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges`)
            process.exit(1)
        case "EADDRINUSE":
            console.error(`${bind} is already in use`)
            process.exit(1)
        default:
            console.error(error)
            break;
    }
}

/**
 * 
 * @param {*} begin 
 * @param {*} end 
 * @param {*} interval 
 */
export function* range(begin, end, interval = 1) {
    for (let i = begin; i < end; i += interval) {
        yield i
    }
}

/**
 * 
 * @param {*} min 
 * @param {*} max 
 * @returns 
 */
export const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

/**
 * 
 * @param {*} data 
 * @returns 
 */
export const isArray = data => Array.isArray(data)

/**
 * 
 * @param {*} data 
 * @returns 
 */
export const isObject = data => typeof data === "object" && !isArray(data)

/**
 * 
 * @param {*} string 
 * @returns 
 */
export const isBycryptedHash = (string) => /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/.test(string)
/**
 * 
 * @param {*} value 
 * @returns 
 */
export const isEmpty = (value) => [null, undefined, "", ''].includes(value)