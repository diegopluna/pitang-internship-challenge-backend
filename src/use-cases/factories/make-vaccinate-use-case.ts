import { PrismaAppointmentsRepository } from '@/repositories/prisma/prisma-appointments-repository'
import { VaccinateUseCase } from '../vaccinate-use-case'

export async function makeVaccinateUseCase() {
  const appointmentsRepository = new PrismaAppointmentsRepository()

  const useCase = new VaccinateUseCase(appointmentsRepository)

  return useCase
}
