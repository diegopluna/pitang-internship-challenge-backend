import { FastifySchema } from 'fastify'

export const GetByIdSwaggerSchema: FastifySchema = {
  description: 'Busca um agendamento de vacina por ID',
  tags: ['Agendamentos'],
  summary: 'Busca um agendamento de vacina por ID',
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
    200: {
      description: 'Agendamento encontrado com sucesso',
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
}
