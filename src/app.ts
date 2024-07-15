import fastifyHelmet from '@fastify/helmet'
import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { env } from './env'
import { appointmentsRoutes } from './http/controllers/appointments/routes'
import { ZodError } from 'zod'
import openApiJSON from '@/config/openapi/openapi.json'

export const app = fastify({ logger: true })

app.register(fastifyHelmet)
app.register(fastifyCors)

app.register(ScalarApiReference, {
  routePrefix: '/docs',
  configuration: {
    spec: {
      content: openApiJSON,
    },
  },
})

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
