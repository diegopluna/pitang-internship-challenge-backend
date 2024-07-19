import {
  isIsoDateFormat,
  isIsoDateStringBeforeCurrentDate,
  isIsoDateStringValid,
  isTimestampValid,
  newUTCDateFromIsoDateString,
  newUTCDateFromTimestamp,
} from '@/utils/date-utils'
import { FastifyRequest } from 'fastify'
import { z } from 'zod'

export const updateAppointmentValidator = z.object({
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
    .transform((timestamp) => {
      return newUTCDateFromTimestamp(timestamp)
    }),
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
