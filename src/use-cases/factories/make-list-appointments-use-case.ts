import { PrismaAppointmentsRepository } from '@/repositories/prisma/prisma-appointments-repository'
import { ListAppointmentsUseCase } from '../list-appointments'

export function makeListAppointmentsUseCase() {
  const appointmentsRepository = new PrismaAppointmentsRepository()

  const useCase = new ListAppointmentsUseCase(appointmentsRepository)

  return useCase
}
