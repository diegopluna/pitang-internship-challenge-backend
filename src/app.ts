import fastifyHelmet from '@fastify/helmet'
import fastify from 'fastify'

export const app = fastify({ logger: true })

app.register(fastifyHelmet)

app.setErrorHandler((error, _, reply) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(error)
  }

  reply.status(500).send({ message: 'Internal server error' })
})
