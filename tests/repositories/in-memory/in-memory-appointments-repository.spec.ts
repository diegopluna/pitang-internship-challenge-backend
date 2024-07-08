import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAppointmentsRepository } from '@/repositories/in-memory/in-memory-appointments-repository'
import {
  mockCreateAppointmentInput,
  mockCreateAppointmentUseCaseInput,
} from '@tests/mocks/appointments-mocks'
import { addDays } from 'date-fns'

describe('In-Memory Appointments Repository', () => {
  const sut = new InMemoryAppointmentsRepository()

  beforeEach(() => {
    InMemoryAppointmentsRepository.appointments = []
  })

  it('should create an appointment', async () => {
    const appointmentInput = mockCreateAppointmentInput()

    const result = await sut.create(appointmentInput)

    expect(result).toEqual(expect.objectContaining(appointmentInput))
    expect(result.vaccinationComplete).toBe(false)
  })

  it('should find appointments by day', async () => {
    const appointment1 = mockCreateAppointmentUseCaseInput()
    const appointment2 = mockCreateAppointmentUseCaseInput({
      appointmentDate: appointment1.appointmentDate.getTime(),
    })
    const appointment3 = mockCreateAppointmentUseCaseInput({
      appointmentDate: addDays(appointment1.appointmentDate, 1).getTime(),
    })

    const createdAppointment1 = await sut.create(appointment1)
    const createdAppointment2 = await sut.create(appointment2)
    await sut.create(appointment3)

    const result = await sut.findByDay(appointment1.appointmentDate)

    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining([createdAppointment1, createdAppointment2]),
    )
  })
})
