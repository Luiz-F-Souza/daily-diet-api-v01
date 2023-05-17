import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knexSetup } from '../knexConfig'
import crypto from 'crypto'


async function createUserRoute(app:FastifyInstance) {

  app.post('/', async (request, reply) => {
    const createUserRequestSchema = z.object({
      email: z.string().email('Digite um email válido').nonempty('Digite um email'),
      password: z.string().min(6,"A senha precisa ter, no mínimo, 6 caracteres 😊"),
      name: z.string().min(3, 'Digite seu nome 😊')
    })

    try{
      const requestBody = createUserRequestSchema.parse(request.body)


      const { email, password, name } = requestBody

      const cryptoSalt = crypto.randomBytes(16).toString('hex')

      const encryptedPassword = crypto.createHash('sha256').update(password + cryptoSalt).digest('hex')
  
      await knexSetup('users').insert({
        email,
        password: encryptedPassword,
        crypto_salt: cryptoSalt,
        name
      })
  
      return reply.status(201).send('Cadastro de usuário efetuado com sucesso 👍')
    }
    catch(err){
      return reply.status(400).send(`não foi possível criar o usuário 🥲. => ${err}`)
    }

  })
  
}

export { createUserRoute }