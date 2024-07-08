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
}
