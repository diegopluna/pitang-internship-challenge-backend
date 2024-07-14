import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeToggleVaccinatedUseCase } from '@/use-cases/factories/make-toggle-vaccinated-use-case'
import { validateGetAppointmentByIdInput } from '@/validators/get-appointment-by-id-validator'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function toggle(request: FastifyRequest, reply: FastifyReply) {
  const { id } = validateGetAppointmentByIdInput(request)

  try {
    const toggleVaccinatedUseCase = await makeToggleVaccinatedUseCase()

    await toggleVaccinatedUseCase.execute({ id })

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    throw error
  }
}
