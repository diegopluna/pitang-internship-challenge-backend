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
      required_error: 'Nome é obrigatório',
      invalid_type_error: 'Nome deve ser uma string',
    })
    .trim()
    .min(1, { message: 'Nome não pode ser vazio' }),
  birthDay: z
    .string()
    .refine(
      (dateStr) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/
        return regex.test(dateStr)
      },
      {
        message:
          'Formato de data de aniversário inválido. Formato esperado: YYYY-MM-DD',
      },
    )
    .refine(
      (dateStr) => {
        const date = parseISO(dateStr)

        return isValid(date)
      },
      {
        message: 'Data de aniversário inválida. Formato esperado: YYYY-MM-DD',
      },
    )
    .refine(
      (dateStr) => {
        const date = parseISO(dateStr)

        return isBefore(date, new Date())
      },
      {
        message: 'A data de aniversário deve ser anterior à data atual.',
      },
    )
    .transform((dateStr) => {
      const date = parseISO(dateStr)

      return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
      )
    }),
  appointmentDate: z
    .number({
      required_error: 'Data de agendamento é obrigatória',
      invalid_type_error:
        'Data de agendamento deve ser um número no formato Unix timestamp',
    })
    .refine(
      (timestamp) => {
        const date = fromUnixTime(timestamp / 1000)
        return isValid(date)
      },
      {
        message:
          'Data de agendamento inválida. Formato esperado: Unix timestamp em milissegundos',
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
        message:
          'A data de agendamento deve ser posterior à data e hora atual.',
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
