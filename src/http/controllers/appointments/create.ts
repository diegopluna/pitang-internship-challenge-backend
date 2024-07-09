import { AppointmentOutsideAllowedHoursError } from '@/use-cases/errors/appointment-outside-allowed-hours-error'
import { MaxNumberOfAppointmentsInSameDayError } from '@/use-cases/errors/max-number-of-appointments-in-same-day-error'
import { MaxNumberOfAppointmentsInSameHourError } from '@/use-cases/errors/max-number-of-appointments-in-same-hour'
import { makeCreateAppointmentUseCase } from '@/use-cases/factories/make-create-appointment-use-case'
import { validateCreateAppointmentInput } from '@/validators/create-appointment-validator'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const { name, birthDay, appointmentDate } =
    validateCreateAppointmentInput(request)

  try {
    const createAppointmentUseCase = makeCreateAppointmentUseCase()

    await createAppointmentUseCase.execute({
      name,
      birthDay,
      appointmentDate,
    })
  } catch (error) {
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

  return reply.status(201).send()
}
