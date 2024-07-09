import { FastifyInstance } from 'fastify'
import { create } from './create'
import { list } from './list'

export async function appointmentsRoutes(app: FastifyInstance) {
  app.post('/', create)
  app.get('/', list)
}
