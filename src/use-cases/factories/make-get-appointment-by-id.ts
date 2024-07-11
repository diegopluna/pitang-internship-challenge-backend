import { PrismaAppointmentsRepository } from '@/repositories/prisma/prisma-appointments-repository'
import { GetAppointmentByIdUseCase } from '../get-appointment-by-id'

export function makeGetAppointmentById() {
  const appointmentsRepository = new PrismaAppointmentsRepository()

  const useCase = new GetAppointmentByIdUseCase(appointmentsRepository)

  return useCase
}
