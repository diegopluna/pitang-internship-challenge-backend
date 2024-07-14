import { FastifySchema } from 'fastify'

export const ToggleSwaggerSchema: FastifySchema = {
  description: 'Atualiza o status de uma vacina',
  tags: ['Agendamentos'],
  summary: 'Atualiza o status de uma vacina',
  consumes: ['application/json'],
  produces: [],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  response: {
    204: {
      description: 'Vacina atualizada com sucesso',
      type: 'null',
    },
  },
}
