import { InMemoryAppointmentsRepository } from '@/repositories/in-memory/in-memory-appointments-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GetAppointmentByIdUseCase } from '@/use-cases/get-appointment-by-id'
import { mockCreateAppointmentUseCaseInput } from '@tests/mocks/appointments-mocks'
import { AppointmentNotFoundError } from '@/use-cases/errors/appointment-not-found-error'

describe('Get Appointment By Id Use Case', () => {
  const appointmentsRepository = new InMemoryAppointmentsRepository()
  const sut = new GetAppointmentByIdUseCase(appointmentsRepository)

  beforeEach(() => {
    InMemoryAppointmentsRepository.appointments = []
  })

  it('should be able to get an appointment by id', async () => {
    const appointmentData = mockCreateAppointmentUseCaseInput()
    const createdAppointment =
      await appointmentsRepository.create(appointmentData)

    const { appointment } = await sut.execute({ id: createdAppointment.id })

    expect(appointment).toEqual(createdAppointment)
  })

  it('should throw AppointmentNotFoundError if appointment does not exist', async () => {
    await expect(() =>
      sut.execute({ id: 'non-existent-id' }),
    ).rejects.toBeInstanceOf(AppointmentNotFoundError)
  })
})
