import fastifyHelmet from '@fastify/helmet'
import fastify from 'fastify'
import { env } from './env'

export const app = fastify({ logger: true })

app.register(fastifyHelmet)

app.setErrorHandler((error, _, reply) => {
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  reply.status(500).send({ message: 'Internal server error' })
})
