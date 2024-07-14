import { FastifyInstance } from 'fastify'
import { create } from './create'
import { list } from './list'
import { getById } from './get-by-id'
import { toggle } from './toggle'
import { CreateSwaggerSchema } from '@/config/schemas/create'
import { ListSwaggerSchema } from '@/config/schemas/list'
import { GetByIdSwaggerSchema } from '@/config/schemas/get-by-id'
import { ToggleSwaggerSchema } from '@/config/schemas/toggle'

export async function appointmentsRoutes(app: FastifyInstance) {
  app.post('/', { schema: CreateSwaggerSchema }, create)
  app.get('/', { schema: ListSwaggerSchema }, list)
  app.get('/:id', { schema: GetByIdSwaggerSchema }, getById)
  app.patch('/:id/toggle-vaccinated', { schema: ToggleSwaggerSchema }, toggle)
}
