import { Appointment, Prisma } from '@prisma/client'

export interface AppointmentsRepository {
  create: (data: Prisma.AppointmentCreateInput) => Promise<Appointment>
}
