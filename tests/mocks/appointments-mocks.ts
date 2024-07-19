import { createUTCDate, formatDateToIsoDateString } from '@/utils/date-utils'
import { createAppointmentValidator } from '@/validators/create-appointment-validator'
import { faker } from '@faker-js/faker'
import { Prisma } from '@prisma/client'

export const mockCreateAppointmentInput = (): Prisma.AppointmentCreateInput => {
  const birthDayUnformatted = faker.date.birthdate()
  const birthDay = createUTCDate({
    year: birthDayUnformatted.getFullYear(),
    month: birthDayUnformatted.getMonth(),
    day: birthDayUnformatted.getDate(),
  })

  const appointmentDateUnformatted = faker.date.future()
  const appointmentDate = createUTCDate({
    year: appointmentDateUnformatted.getFullYear(),
    month: appointmentDateUnformatted.getMonth(),
    day: appointmentDateUnformatted.getDate(),
    hour: appointmentDateUnformatted.getHours(),
  })

  return {
    name: faker.person.fullName(),
    birthDay,
    appointmentDate,
  }
}

export const mockCreateAppointmentControllerInput = () => {
  const baseDate = faker.date.future()
  const appointmentDate = createUTCDate({
    year: baseDate.getUTCFullYear(),
    month: baseDate.getUTCMonth(),
    day: baseDate.getUTCDate(),
    hour: faker.number.int({ min: 9, max: 22 }),
  }).getTime()

  return {
    name: faker.person.fullName(),
    birthDay: formatDateToIsoDateString(faker.date.birthdate()),
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
