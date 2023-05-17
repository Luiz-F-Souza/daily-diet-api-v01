import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {

  await knex.schema.createTable('meals', (columns) => {
    columns.uuid('id').primary()
    columns.string('user_email').notNullable().index()
    columns.string('description').notNullable()
    columns.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    columns.timestamp('updated_at')
    columns.boolean('is_inside_diet').notNullable()
    columns.date('eaten_date_time').notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}

