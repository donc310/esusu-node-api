import { env, stage } from "../helpers/core.helper"

export default {
    name: env("APP_NAME", "Esusu API"),
    port: env("APP_PORT", 3000, Number),
    debug: env("APP_DEBUG", (stage === 'development'), Boolean),
    encryption: {
        key: env('APP_ENCRYPTION_KEY', '5ecb87f153ef2c21e39beaece40ad656cc27af271e05f5f87c11e6ba44725257'),
        algorithm: env('APP_ENCRYPTION_ALGORITHM', 'aes-256-cbc'),
        iv_length: env("APP_ENCRYPTION_IV_LENGTH", 16, Number)
    }
}
