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

    const appointmentHour = appointmentDate.getUTCHours()

    // Comparing with UTC time, which is 06:00 and 19:00 in Brazil
    if (appointmentHour < 9 || appointmentHour > 22) {
      throw new AppointmentOutsideAllowedHoursError()
    }

    const appointmentsWithinSameDay =
      await this.appointmentsRepository.findByDay(appointmentDate)

    // Excluding the current appointment since it is already there and could move to another time in the same day without violating the rules
    const appointmentsWithinSameDayExcludingCurrentAppointment =
      appointmentsWithinSameDay.filter((appointment) => appointment.id !== id)

    if (appointmentsWithinSameDayExcludingCurrentAppointment.length >= 20) {
      throw new MaxNumberOfAppointmentsInSameDayError()
    }

    const appointmentsInSameHour =
      appointmentsWithinSameDayExcludingCurrentAppointment.filter(
        (appointment) =>
          appointment.appointmentDate.getUTCHours() === appointmentHour,
      )

    if (appointmentsInSameHour.length >= 2) {
      throw new MaxNumberOfAppointmentsInSameHourError()
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
