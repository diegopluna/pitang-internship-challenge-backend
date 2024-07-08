import { FastifyRequest } from 'fastify'
import { z } from 'zod'

export const createAppointmentValidator = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .trim()
    .min(1, { message: 'Name must not be empty' }),
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentValidator>

export function validateCreateAppointmentInput(
  request: FastifyRequest,
): CreateAppointmentInput {
  return createAppointmentValidator.parse(request.body)
}
