import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAppointmentsRepository } from '@/repositories/in-memory/in-memory-appointments-repository'
import { Prisma } from '@prisma/client'
import { faker } from '@faker-js/faker'

describe('In-Memory Appointments Repository', () => {
  const sut = new InMemoryAppointmentsRepository()

  beforeEach(() => {
    InMemoryAppointmentsRepository.appointments = []
  })

  it('should create an appointment', async () => {
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

    const appointmentInput: Prisma.AppointmentCreateInput = {
      name: faker.person.fullName(),
      birthDay,
      appointmentDate,
    }

    const result = await sut.create(appointmentInput)

    expect(result).toEqual(expect.objectContaining(appointmentInput))
    expect(result.vaccinationComplete).toBe(false)
  })
})
