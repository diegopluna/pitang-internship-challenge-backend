import { FastifyInstance } from 'fastify'
import { create } from './create'

export async function appointmentsRoutes(app: FastifyInstance) {
  app.post('/', create)
}
