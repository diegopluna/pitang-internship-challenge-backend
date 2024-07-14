import { FastifySchema } from 'fastify'

export const CreateSwaggerSchema: FastifySchema = {
  description: 'Criar um novo agendamento de vacina',
  tags: ['Agendamentos'],
  summary: 'Criar um novo agendamento de vacina',
  consumes: ['application/json'],
  produces: [],
  body: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Nome do paciente',
      },
      birthDay: {
        type: 'string',
        description: 'Data de nascimento do paciente no formato YYYY-MM-DD',
        format: 'date',
      },
      appointmentDate: {
        type: 'number',
        description:
          'Data e Hora do agendamento no formato de Unix Timestamp em ms.',
      },
    },
    required: ['name', 'birthDay', 'appointmentDate'],
  },
  response: {
    201: {
      description: 'Agendamento criado com sucesso',
      type: 'null',
    },
    400: {
      description: 'Erro ao criar o agendamento',
      type: 'object',
      properties: {
        message: { type: 'string' },
        issues: { type: 'array' },
      },
      required: ['message'],
    },
    500: {
      description: 'Erro interno do servidor',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
      required: ['message'],
    },
  },
}
