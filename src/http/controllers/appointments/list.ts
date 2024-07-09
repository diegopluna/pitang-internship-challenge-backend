import { makeListAppointmentsUseCase } from '@/use-cases/factories/make-list-appointments-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function list(request: FastifyRequest, reply: FastifyReply) {
  const listAppointmentsUseCase = makeListAppointmentsUseCase()

  const { appointments } = await listAppointmentsUseCase.execute()

  return reply.status(200).send({ appointments })
}
