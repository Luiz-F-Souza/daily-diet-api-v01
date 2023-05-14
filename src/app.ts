import fastify from "fastify";
import { createUserRoute } from "./routes/createUserRoute";

export const app = fastify()

app.register(createUserRoute, {
  prefix: 'create-user'
})