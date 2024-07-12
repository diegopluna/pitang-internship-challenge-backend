import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeGetAppointmentByIdUseCase } from '@/use-cases/factories/make-get-appointment-by-id-use-case'
import { validateGetAppointmentByIdInput } from '@/validators/get-appointment-by-id-validator'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = validateGetAppointmentByIdInput(request)

  try {
    const getAppointmentByIdUseCase = makeGetAppointmentByIdUseCase()

    const appointment = await getAppointmentByIdUseCase.execute({ id })

    return reply.status(200).send(appointment)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
