import { Appointment, Prisma } from '@prisma/client'
import { AppointmentsRepository } from '../appointments-repository'
import { prisma } from '@/lib/prisma'
import { createUTCDate } from '@/utils/date-utils'

export class PrismaAppointmentsRepository implements AppointmentsRepository {
  async create(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
    const appointment = await prisma.appointment.create({
      data,
    })

    return appointment
  }

  async findByDay(date: Date): Promise<Appointment[]> {
    const utcDateDayStart = createUTCDate({
      year: date.getUTCFullYear(),
      month: date.getUTCMonth(),
      day: date.getUTCDate(),
    })
    const utcDateDayEnd = createUTCDate({
      year: date.getUTCFullYear(),
      month: date.getUTCMonth(),
      day: date.getUTCDate(),
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
    })

    const appointments = await prisma.appointment.findMany({
      where: {
        appointmentDate: {
          gte: utcDateDayStart,
          lte: utcDateDayEnd,
        },
      },
    })

    return appointments
  }

  async findAll(): Promise<Appointment[]> {
    return await prisma.appointment.findMany({
      orderBy: {
        appointmentDate: 'asc',
      },
    })
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id,
      },
    })

    return appointment
  }

  async update(data: Appointment): Promise<Appointment> {
    const appointment = await prisma.appointment.update({
      where: {
        id: data.id,
      },
      data,
    })

    return appointment
  }
}
