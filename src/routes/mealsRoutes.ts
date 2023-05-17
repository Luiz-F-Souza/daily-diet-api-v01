import { FastifyInstance } from "fastify";
import { z } from 'zod'
import { knexSetup } from "../knexConfig";
import crypto from 'crypto'
import { checkIfUserIsLogged } from "../middlewares/checkIfUserIsLogged";

const preHandler = [checkIfUserIsLogged]

async function mealsRoutes( app: FastifyInstance ) {
  
  // New Meal
  app.post('/new-meal',{preHandler},async (request, reply) => {

    const { emailLogged } = request.cookies

    const newMealRequestSchema = z.object({
      description: z.string().min(4, "Descreva sua dúvida com pelo menos 4 caracteres 😉").nonempty(),
      isInsideDiet: z.boolean(),
      eatenDate: z.string().regex(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/,"Informe uma data no formato: ddmmyyyy"),
      eatenTime: z.string().regex(/[0-9]{2}:[0-9]{2}/, 'Insira a hora no formato: hh:mm')
    })


    try{
      const requestBody = newMealRequestSchema.parse(request.body)

      const { description, isInsideDiet, eatenDate, eatenTime } = requestBody

      const dateInIso = `${eatenDate.slice(6)}-${eatenDate.slice(3,5)}-${eatenDate.slice(0,2)}`
      const fullDataIso = `${dateInIso}T${eatenTime}:00.123Z`


      await knexSetup('meals').insert({
        id: crypto.randomUUID(),
        description,
        user_email: emailLogged,
        is_inside_diet: isInsideDiet,
        eaten_date_time: fullDataIso
      })
      

      return reply.status(201).send('Cadastro da refeição efetuado com sucesso 👍')
    }
    catch(err){
     return reply.status(400).send(`Não foi possível registrar a refeição 🥲, => ${err}`)
    }

  })

  // Edit specific meal
  app.put('/edit/:id',{preHandler} ,async (request, reply) => {

    const { emailLogged } = request.cookies

    const editMealRequestSchema = z.object({
      description: z.string().optional(),
      is_inside_diet: z.boolean().optional()
    })

    const paramsSchema = z.object({
      id: z.string()
    })

    const params = paramsSchema.parse(request.params)

    const requestBody = editMealRequestSchema.parse(request.body)

    const { id } = params

    try{
      const requestObj: typeof requestBody = {}

      await knexSetup('meals').where({id, "user_email": emailLogged}).update(requestBody)

      return reply.status(200).send('Refeição alterada com sucesso 😉')
    }
    catch(err){
      return reply.status(400).send(`⚠️ Não foi possível editar 🥲 => ${err}`)
    }


  })

  // Deletes specific meal
  app.delete('/delete/:id',{preHandler},async(request, reply) => {

    const { emailLogged } = request.cookies

    const paramsSchema = z.object({
      id: z.string().uuid("Digite um uuid em formato válido").nonempty()
    })

    const { id } = paramsSchema.parse(request.params)

    try{
      const deleted = await knexSetup('meals').where({id, "user_email":emailLogged}).delete()

      if (!deleted) throw new Error('o uuid informado não existe na base de dados')
      
      return reply.status(200).send('Refeição deletada com sucesso!')
    }
    catch(err){
      return reply.status(400).send(`Não foi posível deletar a refeição 🥲 => ${err}`)
    }
  })

  // Gets all meals
  app.get('/all',{preHandler} ,async (request, reply) => {

    const { emailLogged } = request.cookies

    try{
      

      const allMeals = await knexSetup('meals').where('user_email', emailLogged)

      return reply.status(200).send({ allMeals, registeredMealsQuantity: allMeals.length })


    }
    catch(err){
      return reply.status(400).send(err)
    }
    
  })

  // Gets specific meal
  app.get('/:id',{preHandler},async (request, reply) => {

    const paramsSchema = z.object({ id: z.string().nonempty() })

    const params = paramsSchema.parse(request.params)

    const { emailLogged } = request.cookies
    const { id } = params   

    try{
      const meal = await knexSetup('meals').where({
        'user_email': emailLogged,
        id
      }).first()

      return reply.status(200).send({ meal })
    }
    catch(err){
      return reply.status(400).send(err)
    }
  })
}

export { mealsRoutes }