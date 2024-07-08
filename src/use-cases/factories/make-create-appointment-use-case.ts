import { CreateAppointmentUseCase } from '../create-appointment'
import { PrismaAppointmentsRepository } from '@/repositories/prisma/prisma-appointments-repository'

export function makeCreateAppointmentUseCase() {
  const appointmentsRepository = new PrismaAppointmentsRepository()

  const useCase = new CreateAppointmentUseCase(appointmentsRepository)

  return useCase
}
