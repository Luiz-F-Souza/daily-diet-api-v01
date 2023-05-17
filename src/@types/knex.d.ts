import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string,
      user_email: string,
      description: string,
      created_at: string,
      updated_at?: string,
      is_inside_diet: boolean,
      eaten_date_time: string,
    },
  
    users:{
      email: string,
      name: string,
      created_at: string,
      password: string,
      crypto_salt: string,
    }
  }
}
