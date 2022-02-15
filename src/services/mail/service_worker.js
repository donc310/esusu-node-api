import "core-js/stable";
import "regenerator-runtime/runtime";
import { src_path } from "../../helpers/core.helper"
import queue from "./mail-service"

/**
 * Create a processor for running tasks relating to tennants.
 */
export function createWorker() {
    console.log("Creating Processor for email service")
    queue.process(src_path("services/mail/processor.js"))
}