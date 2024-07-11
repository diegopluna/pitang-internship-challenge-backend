import { FastifyRequest } from 'fastify'
import { z } from 'zod'

export const getAppointmentByIdValidator = z.object({
  id: z
    .string({
      message: 'ID é obrigatório',
    })
    .uuid({
      message: 'ID inválido',
    }),
})

export type GetAppointmentByIdValidator = z.infer<
  typeof getAppointmentByIdValidator
>

export function validateGetAppointmentByIdInput(
  request: FastifyRequest,
): GetAppointmentByIdValidator {
  return getAppointmentByIdValidator.parse(request.params)
}
