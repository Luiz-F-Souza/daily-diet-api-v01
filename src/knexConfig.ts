import {knex, Knex} from "knex"

export const knexConfig: Knex.Config = {
  client: "sqlite",
  useNullAsDefault: true,
  connection:{
    filename: './db/app.db',
  },
  migrations: {
    extension: 'ts',
    directory: "./db/migrations",
  }
}

export const knexSetup = knex(knexConfig)