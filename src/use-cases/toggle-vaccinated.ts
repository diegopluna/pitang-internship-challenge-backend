import { AppointmentsRepository } from '@/repositories/appointments-repository'
import { Appointment } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface VaccinateUseCaseRequest {
  id: string
}

interface VaccinateUseCaseResponse {
  appointment: Appointment
}

export class ToogleVaccinatedUseCase {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  async execute(
    request: VaccinateUseCaseRequest,
  ): Promise<VaccinateUseCaseResponse> {
    const appointment = await this.appointmentsRepository.findById(request.id)

    if (!appointment) {
      throw new ResourceNotFoundError()
    }

    const updatedAppointment = await this.appointmentsRepository.update({
      ...appointment,
      vaccinationComplete: !appointment.vaccinationComplete,
    })

    return { appointment: updatedAppointment }
  }
}
