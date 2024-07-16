import { AppointmentOutsideAllowedHoursError } from '@/use-cases/errors/appointment-outside-allowed-hours-error'
import { MaxNumberOfAppointmentsInSameDayError } from '@/use-cases/errors/max-number-of-appointments-in-same-day-error'
import { MaxNumberOfAppointmentsInSameHourError } from '@/use-cases/errors/max-number-of-appointments-in-same-hour'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeUpdateAppointmentUseCase } from '@/use-cases/factories/make-update-appointment-use-case'
import { validateGetAppointmentByIdInput } from '@/validators/get-appointment-by-id-validator'
import { validateUpdateAppointmentInput } from '@/validators/update-appointment-validator'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function update(request: FastifyRequest, reply: FastifyReply) {
  const { id } = validateGetAppointmentByIdInput(request)
  const { name, birthDay, appointmentDate, vaccinationComplete } =
    validateUpdateAppointmentInput(request)

  try {
    const updateAppointmentUseCase = makeUpdateAppointmentUseCase()

    await updateAppointmentUseCase.execute({
      id,
      name,
      birthDay,
      appointmentDate,
      vaccinationComplete,
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }

    if (error instanceof AppointmentOutsideAllowedHoursError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof MaxNumberOfAppointmentsInSameDayError) {
      return reply.status(400).send({ message: error.message })
    }

    if (error instanceof MaxNumberOfAppointmentsInSameHourError) {
      return reply.status(400).send({ message: error.message })
    }

    throw error
  }

  return reply.status(204).send()
}
