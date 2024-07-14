import { FastifySchema } from 'fastify'

export const ListSwaggerSchema: FastifySchema = {
  description: 'Lista todos os agendamentos de vacinas',
  tags: ['Agendamentos'],
  summary: 'Lista todos os agendamentos de vacinas',
  consumes: ['application/json'],
  produces: [],
  response: {
    200: {
      description: 'Agendamentos listados com sucesso',
      type: 'object',
      properties: {
        appointments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              birthDay: { type: 'string' },
              appointmentDate: { type: 'string' },
              vaccinationCompleted: { type: 'boolean' },
            },
          },
        },
      },
    },
  },
}
