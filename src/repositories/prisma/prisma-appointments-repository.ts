import { Appointment, Prisma } from '@prisma/client'
import { AppointmentsRepository } from '../appointments-repository'
import { prisma } from '@/lib/prisma'

export class PrismaAppointmentsRepository implements AppointmentsRepository {
  async create(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
    const appointment = await prisma.appointment.create({
      data,
    })

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
}