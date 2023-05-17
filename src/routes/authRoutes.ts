import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knexSetup } from '../knexConfig'
import crypto from 'crypto'


async function authRoutes(app: FastifyInstance){

  app.post('/login', async (request, reply) => {
    
    const requestBodySchema = z.object({
      email: z.string().email().nonempty(),
      password: z.string().nonempty()
    })

    const body = requestBodySchema.parse(request.body)

    try{
      const { email, password } = body

      const userData = await knexSetup('users').where('email',email).first()

      if(!userData) throw new Error('Email ou senha incorretos')

      const { crypto_salt: cryptoSalt, password: userPassword } = userData

      const encryptedPass = crypto.createHash('sha256').update(password + cryptoSalt).digest('hex')

      if(encryptedPass !== userPassword) throw new Error('Email ou senha incorretos')

      reply.setCookie('emailLogged', email, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 100, // 100 days
        httpOnly: true,
      })
      
     return reply.status(200).send('logado')
    }
    catch(err){
      return reply.status(400).send(err)
    }
  })

  app.delete('/logout', async (request, reply) => {
    reply.clearCookie('emailLogged', {
      path: '/'
    })
  })
}

export { authRoutes }