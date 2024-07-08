import {
  endOfHour,
  fromUnixTime,
  isAfter,
  isBefore,
  isValid,
  parseISO,
} from 'date-fns'
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

        return isValid(date)
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
  appointmentDate: z
    .number()
    .refine(
      (timestamp) => {
        const date = fromUnixTime(timestamp / 1000)
        return isValid(date)
      },
      {
        message:
          'Invalid date format. Expected Unix timestamp in milliseconds.',
      },
    )
    .refine(
      (timestamp) => {
        const date = fromUnixTime(timestamp / 1000)
        const now = new Date()
        const currentHour = endOfHour(now)
        return isAfter(date, currentHour)
      },
      {
        message: 'The appointmentDate must be in the future.',
      },
    )
    .transform((timestamp) => {
      const date = new Date(timestamp)
      const utcDate = new Date(
        Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          date.getUTCHours(),
          0,
          0,
          0,
        ),
      )
      return utcDate
    }),
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentValidator>

export function validateCreateAppointmentInput(
  request: FastifyRequest,
): CreateAppointmentInput {
  return createAppointmentValidator.parse(request.body)
}
