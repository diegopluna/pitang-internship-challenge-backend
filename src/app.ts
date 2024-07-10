import fastifyHelmet from '@fastify/helmet'
import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import { env } from './env'
import { appointmentsRoutes } from './http/controllers/appointments/routes'
import { ZodError } from 'zod'

export const app = fastify({ logger: true })

app.register(fastifyHelmet)
app.register(fastifyCors)

app.register(appointmentsRoutes, { prefix: '/api/appointments' })

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  reply.status(500).send({ message: 'Internal server error' })
})
