import { UpdateAppointmentUseCase } from '../update-appointment'
import { PrismaAppointmentsRepository } from '@/repositories/prisma/prisma-appointments-repository'

export function makeUpdateAppointmentUseCase() {
  const appointmentsRepository = new PrismaAppointmentsRepository()

  const useCase = new UpdateAppointmentUseCase(appointmentsRepository)

  return useCase
}
