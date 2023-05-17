import fastify from "fastify";
import { createUserRoute } from "./routes/createUserRoute";
import { mealsRoutes } from "./routes/mealsRoutes";
import cookie from '@fastify/cookie'
import { authRoutes } from "./routes/authRoutes";
import { metricsRoute } from "./routes/metricsRoute";

export const app = fastify()

app.register(cookie)

app.register(authRoutes)

app.register(createUserRoute, {
  prefix: 'create-user'
})

app.register(mealsRoutes, {
  prefix: 'meals'
})

app.register(metricsRoute,{
  prefix: 'metrics'
})