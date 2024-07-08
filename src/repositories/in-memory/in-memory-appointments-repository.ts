import { Prisma, Appointment } from '@prisma/client'
import { AppointmentsRepository } from '../appointments-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryAppointmentsRepository implements AppointmentsRepository {
  public static appointments: Appointment[] = []

  async create(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
    const appointment: Appointment = {
      id: randomUUID(),
      name: data.name,
      birthDay: data.birthDay as Date,
      appointmentDate: data.appointmentDate as Date,
      vaccinationComplete: false,
    }

    InMemoryAppointmentsRepository.appointments.push(appointment)

    return appointment
  }

  async findByDay(date: Date): Promise<Appointment[]> {
    const utcDateDayStart = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0,
        0,
      ),
    )

    const utcDateDayEnd = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    )

    return InMemoryAppointmentsRepository.appointments.filter((appointment) => {
      return (
        appointment.appointmentDate >= utcDateDayStart &&
        appointment.appointmentDate <= utcDateDayEnd
      )
    })
  }
}
