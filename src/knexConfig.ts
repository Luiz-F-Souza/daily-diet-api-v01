import {knex, Knex} from "knex"
import { env } from "./env"

export const knexConfig: Knex.Config = {
  client: env.KNEX_CLIENT,
  useNullAsDefault: true,
  connection:{
    filename: env.DATABASE_URL,
  },
  migrations: {
    extension: 'ts',
    directory: "./db/migrations",
  }
}

export const knexSetup = knex(knexConfig)