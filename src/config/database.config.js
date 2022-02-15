import { env, src_path, stage } from "../helpers/core.helper"

import { MIGRATIONS_TABLE } from "../constants/DBTables"

export default {
    client: "postgresql",
    connection: {
        connectionString: env("DATABASE_URL"),
        ssl: stage === 'development' ? false : { 
            rejectUnauthorized: false,
        }
    },
    pool: {
        min: 1,
        max: 3,
    },
    migrations: {
        tableName: MIGRATIONS_TABLE,
        directory: src_path("database/migrations"),
    },
    seeds: {
        directory: src_path("database/seeds"),
    },
}
