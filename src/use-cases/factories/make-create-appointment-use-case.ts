import { InMemoryAppointmentsRepository } from '@/repositories/in-memory/in-memory-appointments-repository'
import { CreateAppointmentUseCase } from '../create-appointment'

export function makeCreateAppointmentUseCase() {
  const appointmentsRepository = new InMemoryAppointmentsRepository()

  const useCase = new CreateAppointmentUseCase(appointmentsRepository)

  return useCase
}
