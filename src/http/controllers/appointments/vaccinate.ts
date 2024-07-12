import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeVaccinateUseCase } from '@/use-cases/factories/make-vaccinate-use-case'
import { validateGetAppointmentByIdInput } from '@/validators/get-appointment-by-id-validator'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function vaccinate(request: FastifyRequest, reply: FastifyReply) {
  const { id } = validateGetAppointmentByIdInput(request)

  try {
    const vaccinateUseCase = await makeVaccinateUseCase()

    await vaccinateUseCase.execute({ id })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
