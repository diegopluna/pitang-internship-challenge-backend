import { AppointmentsRepository } from '@/repositories/appointments-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { AppointmentOutsideAllowedHoursError } from './errors/appointment-outside-allowed-hours-error'
import { MaxNumberOfAppointmentsInSameDayError } from './errors/max-number-of-appointments-in-same-day-error'
import { MaxNumberOfAppointmentsInSameHourError } from './errors/max-number-of-appointments-in-same-hour'

interface UpdateAppointmenteUseCaseRequest {
  id: string
  name: string
  birthDay: Date
  appointmentDate: Date
  vaccinationComplete: boolean
}

export class UpdateAppointmentUseCase {
  constructor(private appointmentsRepository: AppointmentsRepository) {}

  async execute({
    id,
    name,
    birthDay,
    appointmentDate,
    vaccinationComplete,
  }: UpdateAppointmenteUseCaseRequest) {
    const appointment = await this.appointmentsRepository.findById(id)

    if (!appointment) {
      throw new ResourceNotFoundError()
    }

    if (appointment.appointmentDate.getTime() !== appointmentDate.getTime()) {
      const appointmentHour = appointmentDate.getUTCHours()

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
    }

    const updatedAppointment = await this.appointmentsRepository.update({
      id,
      name,
      birthDay,
      appointmentDate,
      vaccinationComplete,
    })

    return {
      appointment: updatedAppointment,
    }
  }
}
