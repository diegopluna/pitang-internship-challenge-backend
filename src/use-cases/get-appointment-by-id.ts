import { AppointmentsRepository } from '@/repositories/appointments-repository'
import { Appointment } from '@prisma/client'
import { AppointmentNotFoundError } from './errors/appointment-not-found-error'

interface GetAppointmentByIdUseCaseRequest {
  id: string
}

interface GetAppointmentByIdUseCaseResponse {
  appointment: Appointment
}

export class GetAppointmentByIdUseCase {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  async execute(
    request: GetAppointmentByIdUseCaseRequest,
  ): Promise<GetAppointmentByIdUseCaseResponse> {
    const appointment = await this.appointmentsRepository.findById(request.id)

    if (!appointment) {
      throw new AppointmentNotFoundError()
    }

    return { appointment }
  }
}
