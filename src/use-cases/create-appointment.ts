import { AppointmentsRepository } from '@/repositories/appointments-repository'
import { MaxNumberOfAppointmentsInSameDayError } from './errors/max-number-of-appointments-in-same-day-error'
import { MaxNumberOfAppointmentsInSameHourError } from './errors/max-number-of-appointments-in-same-hour'
import { AppointmentOutsideAllowedHoursError } from './errors/appointment-outside-allowed-hours-error'
import { Appointment } from '@prisma/client'

interface CreateAppointmenteUseCaseRequest {
  name: string
  birthDay: Date
  appointmentDate: Date
}

interface CreateAppointmentUseCaseResponse {
  appointment: Appointment
}

export class CreateAppointmentUseCase {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  async execute({
    name,
    birthDay,
    appointmentDate,
  }: CreateAppointmenteUseCaseRequest): Promise<CreateAppointmentUseCaseResponse> {
    const appointmentHour = appointmentDate.getUTCHours()

    // Comparando com horário em UTC, que seria 06:00 e 19:00 no Brasil
    if (appointmentHour < 9 || appointmentHour > 22) {
      throw new AppointmentOutsideAllowedHoursError()
    }

    const appointmentsWithinSameDay =
      await this.appointmentsRepository.findByDay(appointmentDate)

    if (appointmentsWithinSameDay.length >= 20) {
      throw new MaxNumberOfAppointmentsInSameDayError()
    }

    const appointmentsInSameHour = appointmentsWithinSameDay.filter(
      (appointment) =>
        appointment.appointmentDate.getUTCHours() === appointmentHour,
    )

    if (appointmentsInSameHour.length >= 2) {
      throw new MaxNumberOfAppointmentsInSameHourError()
    }

    const appointment = await this.appointmentsRepository.create({
      name,
      birthDay,
      appointmentDate,
    })

    return {
      appointment,
    }
  }
}
