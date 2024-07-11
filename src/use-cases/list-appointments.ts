import { Appointment } from '@prisma/client'
import { AppointmentsRepository } from '../repositories/appointments-repository'

interface ListAppointmentsUseCaseResponse {
  appointments: Appointment[]
}

export class ListAppointmentsUseCase {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  async execute(): Promise<ListAppointmentsUseCaseResponse> {
    const appointments = await this.appointmentsRepository.findAll()

    return { appointments }
  }
}
