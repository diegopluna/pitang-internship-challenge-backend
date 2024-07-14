import { InMemoryAppointmentsRepository } from '@/repositories/in-memory/in-memory-appointments-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ToogleVaccinatedUseCase } from '@/use-cases/toggle-vaccinated'
import { mockCreateAppointmentUseCaseInput } from '@tests/mocks/appointments-mocks'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

describe('Vaccinate Use Case', () => {
  let appointmentsRepository: InMemoryAppointmentsRepository
  let sut: ToogleVaccinatedUseCase

  beforeEach(() => {
    appointmentsRepository = new InMemoryAppointmentsRepository()
    sut = new ToogleVaccinatedUseCase(appointmentsRepository)
    InMemoryAppointmentsRepository.appointments = []
  })

  it('should be able to toggle vaccinated', async () => {
    const appointmentData = mockCreateAppointmentUseCaseInput()
    const createdAppointment =
      await appointmentsRepository.create(appointmentData)

    const { appointment } = await sut.execute({ id: createdAppointment.id })

    expect(appointment.id).toEqual(createdAppointment.id)
    expect(appointment.vaccinationComplete).toEqual(
      !createdAppointment.vaccinationComplete,
    )
  })

  it('should throw ResourceNotFoundError if appointment does not exist', async () => {
    await expect(() =>
      sut.execute({ id: 'non-existent-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not change other appointment properties when toggling vaccinated', async () => {
    const appointmentData = mockCreateAppointmentUseCaseInput()
    const createdAppointment =
      await appointmentsRepository.create(appointmentData)

    const { appointment } = await sut.execute({ id: createdAppointment.id })

    expect(appointment).toEqual({
      ...createdAppointment,
      vaccinationComplete: !createdAppointment.vaccinationComplete,
    })
  })
})
