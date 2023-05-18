import { config } from "dotenv";
import { z } from "zod";

//  O VITEST SETA O NODE_ENV PRA TESTE AO RODAR NPX VITEST
if(process.env.NODE_ENV === 'test') {
  config({path:'.env.test'})
}else{
  config()
}


const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  KNEX_CLIENT: z.enum(['sqlite3']),
  DATABASE_URL: z.enum(['./db/app.db', './db/test.db']),
  NODE_ENV: z.enum(['test','development','production'])
})

const _env = envSchema.safeParse(process.env)


if(_env.success === false){
  console.error('⚠️⚠️⚠️ Invalid environment variable 😭', _env.error.format())

  throw new Error('Invalid environment variable 😭')
}

const env = _env.data

export { env }