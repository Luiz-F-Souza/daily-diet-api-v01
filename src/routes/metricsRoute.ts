import { FastifyInstance } from 'fastify'
import { knexSetup } from '../knexConfig'
import { checkIfUserIsLogged } from '../middlewares/checkIfUserIsLogged'

const preHandler = [checkIfUserIsLogged]

async function metricsRoute(app: FastifyInstance){

  app.get("/",{preHandler} ,async (request, reply) => {

    const { emailLogged } = request.cookies

    try{
      const meals = await knexSetup('meals').where('user_email',emailLogged)

      const amountOfMeals = meals.length
      const amountOfMealsInsideDiet = meals.reduce((accumulator, meal) => {
        if(meal.is_inside_diet) return accumulator + 1
        else return accumulator
      },0)
      const amountOfMealsOutsideDiet = amountOfMeals - amountOfMealsInsideDiet

      let bestSequenceOfMealsInsideDiet = 0
      let currentSequence = 0
      meals.forEach( meal => {
        
        if(meal.is_inside_diet) currentSequence++
        else currentSequence = 0
        
        if(currentSequence > bestSequenceOfMealsInsideDiet) bestSequenceOfMealsInsideDiet = currentSequence
      })

      return reply.status(200).send({
        amountOfMeals,
        amountOfMealsInsideDiet,
        amountOfMealsOutsideDiet,
        bestSequenceOfMealsInsideDiet
      })
    }
    catch(err){
      return reply.status(400).send(err)
    }
  })
}

export { metricsRoute }