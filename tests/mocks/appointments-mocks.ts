import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'
import { format } from 'date-fns'

export const mockCreateAppointmentInput = (): Prisma.AppointmentCreateInput => {
  const birthDayUnformatted = faker.date.birthdate()
  const birthDay = new Date(
    Date.UTC(
      birthDayUnformatted.getFullYear(),
      birthDayUnformatted.getMonth(),
      birthDayUnformatted.getDate(),
    ),
  )

  const appointmentDateUnformatted = faker.date.soon()
  const appointmentDate = new Date(
    Date.UTC(
      appointmentDateUnformatted.getFullYear(),
      appointmentDateUnformatted.getMonth(),
      appointmentDateUnformatted.getDate(),
      appointmentDateUnformatted.getHours(),
      0,
      0,
      0,
    ),
  )

  return {
    name: faker.person.fullName(),
    birthDay,
    appointmentDate,
  }
}

export const mockAppointmentControllerInput = () => {
  return {
    name: faker.person.fullName(),
    birthDay: format(faker.date.birthdate(), 'yyyy-MM-dd'),
    appointmentDate: faker.date.future().getTime(),
  }
}
