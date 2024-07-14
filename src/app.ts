import fastifyHelmet from '@fastify/helmet'
import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { env } from './env'
import { appointmentsRoutes } from './http/controllers/appointments/routes'
import { ZodError } from 'zod'
import { swaggerOptions, swaggerUiOptions } from './config/swagger'

export const app = fastify({ logger: true })

app.register(fastifyHelmet)
app.register(fastifyCors)

app.register(fastifySwagger, swaggerOptions)
app.register(fastifySwaggerUi, swaggerUiOptions)

app.register(appointmentsRoutes, { prefix: '/api/appointments' })

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Erro de validação', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  reply.status(500).send({ message: 'Erro interno do servidor' })
})
