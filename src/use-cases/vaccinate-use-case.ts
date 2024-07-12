import { AppointmentsRepository } from '@/repositories/appointments-repository'
import { Appointment } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface VaccinateUseCaseRequest {
  id: string
}

interface VaccinateUseCaseResponse {
  appointment: Appointment
}

export class VaccinateUseCase {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  // TODO: Posso tornar esse método mais performátioco chamando direto o update e se não encontrar o appointment, ele retorna um erro
  async execute(
    request: VaccinateUseCaseRequest,
  ): Promise<VaccinateUseCaseResponse> {
    const appointment = await this.appointmentsRepository.findById(request.id)

    if (!appointment) {
      throw new ResourceNotFoundError()
    }

    const updatedAppointment = await this.appointmentsRepository.update({
      ...appointment,
      vaccinationComplete: true,
    })

    return { appointment: updatedAppointment }
  }
}
