import fastifyHelmet from '@fastify/helmet'
import fastify from 'fastify'

export const app = fastify({ logger: true })

app.register(fastifyHelmet)
