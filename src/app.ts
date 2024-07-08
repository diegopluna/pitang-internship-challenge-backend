import fastifyHelmet from '@fastify/helmet'
import fastify from 'fastify'

export const app = fastify()

app.register(fastifyHelmet)
