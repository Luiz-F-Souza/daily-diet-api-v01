import { FastifyRequest, FastifyReply} from 'fastify'

async function checkIfUserIsLogged(request: FastifyRequest, reply: FastifyReply){

  const { emailLogged } = request.cookies

  if(!emailLogged) return reply.status(400).send('Faça login antes de prosseguir')
}

export { checkIfUserIsLogged }