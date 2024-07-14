import { PrismaAppointmentsRepository } from '@/repositories/prisma/prisma-appointments-repository'
import { ToogleVaccinatedUseCase } from '../toggle-vaccinated'

export async function makeToggleVaccinatedUseCase() {
  const appointmentsRepository = new PrismaAppointmentsRepository()

  const useCase = new ToogleVaccinatedUseCase(appointmentsRepository)

  return useCase
}
