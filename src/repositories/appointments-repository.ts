import { Appointment, Prisma } from '@prisma/client'

export interface AppointmentsRepository {
  create: (data: Prisma.AppointmentCreateInput) => Promise<Appointment>
  findByDay: (date: Date) => Promise<Appointment[]>
  findAll: () => Promise<Appointment[]>
  findById: (id: string) => Promise<Appointment | null>
  update: (data: Appointment) => Promise<Appointment | null>
}
