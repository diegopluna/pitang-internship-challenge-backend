import { createAppointmentValidator } from '@/validators/create-appointment-validator'
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

  const appointmentDateUnformatted = faker.date.future()
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

export const mockCreateAppointmentControllerInput = () => {
  const baseDate = faker.date.future()
  const appointmentDate = new Date(
    Date.UTC(
      baseDate.getUTCFullYear(),
      baseDate.getUTCMonth(),
      baseDate.getUTCDate(),
      faker.number.int({ min: 9, max: 22 }),
      0,
      0,
      0,
    ),
  ).getTime()

  return {
    name: faker.person.fullName(),
    birthDay: format(faker.date.birthdate(), 'yyyy-MM-dd'),
    appointmentDate,
  }
}

export const mockCreateAppointmentUseCaseInput = (
  overrides?: Partial<ReturnType<typeof mockCreateAppointmentControllerInput>>,
) => {
  return createAppointmentValidator.parse({
    ...mockCreateAppointmentControllerInput(),
    ...overrides,
  })
}
