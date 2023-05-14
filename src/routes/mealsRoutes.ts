import { FastifyInstance } from "fastify";
import { z } from 'zod'

async function mealsRoutes( app: FastifyInstance ) {
  
  app.post('/new-meal', async (request, reply) => {
    const newMealSchema = z.object({
      
    })
  })
}