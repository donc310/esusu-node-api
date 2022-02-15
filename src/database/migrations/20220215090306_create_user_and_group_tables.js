/**
 * @typedef {import('knex')} knex
 */

import {
    ACCOUNT_TABLE,
    GROUP_ACCOUNT_TABLE,
    GROUP_TABLE,
    PASSWORD_RESET_TABLE,
    GROUP_INVITATION_TABLE
} from "./../../constants/DBTables"

/**
 * 
 * @param {knex} knex 
 * @returns 
 */
export const up = knex => knex.schema
    .createTable(ACCOUNT_TABLE, table => {
        table.increments()

        table.string("email").unique().notNullable()
        table.string("username").unique().notNullable()
        table.string("password").notNullable()
        table.jsonb("full_name").nullable()
        table.jsonb("metadata").nullable()
        table.enu('status',
            [
                'active',
                'deleted',
                'inactive'
            ], {
            useNative: true,
            enumName: 'client_states'
        }
        ).defaultTo('inactive')
        table.string("profile_picture").nullable()
        table.string("role")

        table.integer("created_by").unsigned().nullable().index().references("id").inTable(ACCOUNT_TABLE)
        table.integer("updated_by").unsigned().nullable().index().references("id").inTable(ACCOUNT_TABLE)
        table.integer("deleted_by").unsigned().nullable().index().references("id").inTable(ACCOUNT_TABLE)
        table.boolean("is_deleted").notNullable().defaultTo(false)

        table.timestamps(true, true)
        table.timestamp("deleted_at")
    })
    .createTable(GROUP_TABLE, table => { 
        table.increments()
        table.uuid("uuid").unique().notNullable()
        table.integer('owner_id').unsigned().notNullable().index().references("id").inTable(ACCOUNT_TABLE)


        table.string("name").unique().notNullable()
        table.string("description", 500).notNullable()
        table.integer("maximum_member").unsigned().defaultTo(0)
        table.integer("savings_amount").unsigned().defaultTo(0)
        table.boolean("is_public").notNullable().defaultTo(true)

        table.integer("created_by").unsigned().nullable().index().references("id").inTable(ACCOUNT_TABLE)
        table.integer("updated_by").unsigned().nullable().index().references("id").inTable(ACCOUNT_TABLE)
        table.integer("deleted_by").unsigned().nullable().index().references("id").inTable(ACCOUNT_TABLE)
        table.boolean("is_deleted").notNullable().defaultTo(false)

        table.timestamps(true, true)
        table.timestamp("deleted_at")
    })
    .createTable(GROUP_ACCOUNT_TABLE, table => {
        table.increments()

        table.integer("group_id").unsigned().index().references("id").inTable(GROUP_TABLE)
        table.integer("account_id").unsigned().index().references("id").inTable(ACCOUNT_TABLE)
        table.integer("savings").unsigned().defaultTo(0)

        table.timestamps(true, true)
    })
    .createTable(PASSWORD_RESET_TABLE, table => {
        table.increments()
        table.integer("account_id").unsigned().index().references("id").inTable(ACCOUNT_TABLE)
        table.string('token', 120).notNullable().index()
        table.dateTime('expires').notNullable()
        table.timestamps(true, true)

    })
    .createTable(GROUP_INVITATION_TABLE, table => {
        table.increments().primary()
        table.integer("account_id").notNullable().unsigned().index().references("id").inTable(ACCOUNT_TABLE)
        table.integer("group_id").notNullable().unsigned().index().references("id").inTable(GROUP_INVITATION_TABLE)

        table.string('email').notNullable()
        table.string('token').notNullable().index()
        table.dateTime('expires').notNullable()
        table.timestamps(true, true)
    })

/**
 * 
 * @param {knex} knex 
 * @returns 
 */
export const down = knex => knex.schema
    .dropTable(ACCOUNT_TABLE)
    .dropTable(GROUP_TABLE)
    .dropTable(GROUP_ACCOUNT_TABLE)
    .dropTable(PASSWORD_RESET_TABLE)
    .dropTable(GROUP_INVITATION_TABLE)