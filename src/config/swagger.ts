import { FastifyDynamicSwaggerOptions } from '@fastify/swagger'
import { FastifySwaggerUiOptions } from '@fastify/swagger-ui'

export const swaggerOptions: FastifyDynamicSwaggerOptions = {
  openapi: {
    info: {
      title: 'Vacina Fácil API',
      description: 'API para agendamento de vacinas da COVID-19',
      version: '1.0.0',
    },
    externalDocs: {
      url: 'https://github.com/diegopluna/pitang-internship-challenge-backend',
      description: 'GitHub',
    },
    servers: [
      {
        url: '/api',
        description: 'API',
      },
    ],
  },
}

export const swaggerUiOptions: FastifySwaggerUiOptions = {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next()
    },
    preHandler: function (request, reply, next) {
      next()
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject) => {
    return swaggerObject
  },
  transformSpecificationClone: true,
}
