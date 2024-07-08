import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryAppointmentsRepository } from '@/repositories/in-memory/in-memory-appointments-repository'
import { mockCreateAppointmentInput } from '@tests/mocks/appointments-mocks'

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
})
