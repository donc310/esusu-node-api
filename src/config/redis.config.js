import { env, stage } from "./../helpers/core.helper"

import Redis from "ioredis"

/**
 * @type {(Redis.RedisOptions|String)}
 */
let config


if (stage === "production") {
    config = env('REDIS_URL')
}
else if (stage === "development") {
    config = {
        host: env("REDIS_HOST", "127.0.0.1"),
        port: env("REDIS_PORT", 6379)
    }
} else {
    config = " "
}

const client = new Redis(config);
const subscriber = new Redis(config);

export const redisConfig = config

export default function createClient(type) {
    switch (type) {
        case 'client':
            return client;
        case 'subscriber':
            return subscriber;
        default:
            return new Redis(config);
    }
}

