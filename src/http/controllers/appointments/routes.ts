import { FastifyInstance } from 'fastify'
import { create } from './create'
import { list } from './list'
import { getById } from './get-by-id'

export async function appointmentsRoutes(app: FastifyInstance) {
  app.post('/', create)
  app.get('/', list)
  app.get('/:id', getById)
}
