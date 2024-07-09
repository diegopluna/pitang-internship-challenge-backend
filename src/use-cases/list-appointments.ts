import { Appointment } from '@prisma/client'
import { AppointmentsRepository } from '../repositories/appointments-repository'

interface ListAppointmentsUseCaseResponse {
  appointments: {
    [date: string]: {
      [hour: string]: Appointment[]
    }
  }
}

export class ListAppointmentsUseCase {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  async execute(): Promise<ListAppointmentsUseCaseResponse> {
    const appointments = await this.appointmentsRepository.findAll()

    const groupedAppointments: ListAppointmentsUseCaseResponse['appointments'] =
      {}

    for (const appointment of appointments) {
      const date = appointment.appointmentDate.toISOString().split('T')[0]
      const hour = `${appointment.appointmentDate.getUTCHours().toString().padStart(2, '0')}:${appointment.appointmentDate.getUTCMinutes().toString().padStart(2, '0')}`

      if (!groupedAppointments[date]) {
        groupedAppointments[date] = {}
      }

      if (!groupedAppointments[date][hour]) {
        groupedAppointments[date][hour] = []
      }

      groupedAppointments[date][hour].push(appointment)
    }

    return { appointments: groupedAppointments }
  }
}
