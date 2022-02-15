/**
 * @typedef {import("../../../types/models").EmailTask} Task
 */

 import "core-js/stable";
 import "regenerator-runtime/runtime";
 
 import {
     PASSED,
     CMD_SEND_EMAIL
 } from "../../constants/Service"
 import {
     sendEmail
 } from "./job_handlers"
 
 import { Job } from "bull"
 
 /**
  * 
  * @param {Job<Task>} job 
  */
 export default async function (job) {
     const { cmd } = job.data
     let result = PASSED
     try {
         switch (cmd) {
             case CMD_SEND_EMAIL:
                 result = await sendEmail(job)
                 break;
             default:
                 break;
         }
         if (result === PASSED) {
             return Promise.resolve(result)
         }
         return Promise.reject(result)
     } catch (e) {
         console.error(e)
         //return Promise.reject(e)
     }
 }