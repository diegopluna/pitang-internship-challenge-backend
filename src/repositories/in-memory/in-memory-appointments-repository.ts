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

  async findAll(): Promise<Appointment[]> {
    return InMemoryAppointmentsRepository.appointments.sort((a, b) => {
      return a.appointmentDate.getTime() - b.appointmentDate.getTime()
    })
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = InMemoryAppointmentsRepository.appointments.find(
      (appointment) => appointment.id === id,
    )

    if (!appointment) {
      return null
    }

    return appointment
  }

  async update(data: Appointment): Promise<Appointment> {
    const appointmentIndex =
      InMemoryAppointmentsRepository.appointments.findIndex(
        (appointment) => appointment.id === data.id,
      )

    if (appointmentIndex === -1) {
      throw new Error()
    }

    const updatedAppointment = {
      ...InMemoryAppointmentsRepository.appointments[appointmentIndex],
      ...(data as Appointment),
    }

    InMemoryAppointmentsRepository.appointments[appointmentIndex] =
      updatedAppointment

    return updatedAppointment
  }
}
