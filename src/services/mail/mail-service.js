/**
 * @typedef {import("../../../types/models").ConnectionConfig} ConnectionConfig
 * @typedef {import("../../../types/models").EmailTask} Task
 * @typedef {import("bull").Job} Job
 */

import { CMD_SEND_EMAIL, EMAIL_QUEUE } from "../../constants/Service"

import Queue from 'bull'
import createClient from '../../config/redis.config'

const emailQueue = new Queue(EMAIL_QUEUE, { createClient })


/**
 * 
 * @param {String} type 
 * @param {Object} payload 
 * @returns Job<Task>
 */
export const send = async (type, payload) => emailQueue.add({ cmd: CMD_SEND_EMAIL, type, payload })


export default emailQueue
