import {
  isIsoDateFormat,
  isIsoDateStringBeforeCurrentDate,
  isIsoDateStringValid,
  isTimeStampAfterCurrentEndOfHour,
  isTimestampValid,
  newUTCDateFromIsoDateString,
  newUTCDateFromTimestamp,
} from '@/utils/date-utils'
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
        return isIsoDateFormat(dateStr)
      },
      {
        message:
          'Formato de data de aniversário inválido. Formato esperado: YYYY-MM-DD',
      },
    )
    .refine(
      (dateStr) => {
        return isIsoDateStringValid(dateStr)
      },
      {
        message: 'Data de aniversário inválida. Formato esperado: YYYY-MM-DD',
      },
    )
    .refine(
      (dateStr) => {
        return isIsoDateStringBeforeCurrentDate(dateStr)
      },
      {
        message: 'A data de aniversário deve ser anterior à data atual.',
      },
    )
    .transform((dateStr) => {
      return newUTCDateFromIsoDateString(dateStr)
    }),
  appointmentDate: z
    .number({
      required_error: 'Data de agendamento é obrigatória',
      invalid_type_error:
        'Data de agendamento deve ser um número no formato Unix timestamp',
    })
    .refine(
      (timestamp) => {
        return isTimestampValid(timestamp)
      },
      {
        message:
          'Data de agendamento inválida. Formato esperado: Unix timestamp em milissegundos',
      },
    )
    .refine(
      (timestamp) => {
        return isTimeStampAfterCurrentEndOfHour(timestamp)
      },
      {
        message:
          'A data de agendamento deve ser posterior à data e hora atual.',
      },
    )
    .transform((timestamp) => {
      return newUTCDateFromTimestamp(timestamp)
    }),
})

export type CreateAppointmentInput = z.infer<typeof createAppointmentValidator>

export function validateCreateAppointmentInput(
  request: FastifyRequest,
): CreateAppointmentInput {
  return createAppointmentValidator.parse(request.body)
}
