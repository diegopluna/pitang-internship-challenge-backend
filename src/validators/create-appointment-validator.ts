import { isBefore, parseISO } from 'date-fns'
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
  birthDay: z
    .string()
    .refine(
      (dateStr) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/
        return regex.test(dateStr)
      },
      {
        message: 'Invalid date format. Expected format: YYYY-MM-DD',
      },
    )
    .refine(
      (dateStr) => {
        const date = parseISO(dateStr)

        return isBefore(date, new Date())
      },
      {
        message: 'The date must be in the past.',
      },
    )
    .transform((dateStr) => {
      const date = parseISO(dateStr)

      return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
      )
    }),
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentValidator>

export function validateCreateAppointmentInput(
  request: FastifyRequest,
): CreateAppointmentInput {
  return createAppointmentValidator.parse(request.body)
}
