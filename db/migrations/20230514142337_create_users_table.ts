import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  await knex.schema.createTable('users', (columns) => {

    columns.string('email').primary()
    columns.string('name').notNullable()
    columns.string('password').notNullable()
    columns.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    columns.string('crypto_salt').notNullable()

  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}

