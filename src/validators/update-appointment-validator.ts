import { FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createAppointmentValidator } from './create-appointment-validator'

export const updateAppointmentValidator = createAppointmentValidator.extend({
  vaccinationComplete: z.boolean({
    required_error: 'VaccinationComplete é obrigatório',
    invalid_type_error: 'VaccinationComplete deve ser um booleano',
  }),
})

export type UpdateAppointmentInput = z.infer<typeof updateAppointmentValidator>

export function validateUpdateAppointmentInput(
  request: FastifyRequest,
): UpdateAppointmentInput {
  return updateAppointmentValidator.parse(request.body)
}
