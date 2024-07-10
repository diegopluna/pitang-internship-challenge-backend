import { InMemoryAppointmentsRepository } from '@/repositories/in-memory/in-memory-appointments-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateAppointmentUseCase } from '@/use-cases/create-appointment'
import { mockCreateAppointmentUseCaseInput } from '@tests/mocks/appointments-mocks'
import { AppointmentOutsideAllowedHoursError } from '@/use-cases/errors/appointment-outside-allowed-hours-error'
import { MaxNumberOfAppointmentsInSameDayError } from '@/use-cases/errors/max-number-of-appointments-in-same-day-error'
import { MaxNumberOfAppointmentsInSameHourError } from '@/use-cases/errors/max-number-of-appointments-in-same-hour'

describe('Create Appointment Use Case', () => {
  const appointmentsRepository = new InMemoryAppointmentsRepository()
  const sut = new CreateAppointmentUseCase(appointmentsRepository)

  beforeEach(() => {
    InMemoryAppointmentsRepository.appointments = []
  })

  it('should be able to create a new appointment', async () => {
    const data = mockCreateAppointmentUseCaseInput()
    const { appointment } = await sut.execute(data)
    expect(appointment.id).toEqual(expect.any(String))
    expect(appointment.vaccinationComplete).toEqual(false)
  })

  it('should not create an appointment before 6amBRT(9am UTC)', async () => {
    const data = mockCreateAppointmentUseCaseInput()
    data.appointmentDate = new Date(data.appointmentDate.setUTCHours(8))

    await expect(() => sut.execute(data)).rejects.toBeInstanceOf(
      AppointmentOutsideAllowedHoursError,
    )
  })

  it('should not create an appointment after 7pmBRT(10pm UTC)', async () => {
    const data = mockCreateAppointmentUseCaseInput()
    data.appointmentDate = new Date(data.appointmentDate.setUTCHours(23))

    await expect(() => sut.execute(data)).rejects.toBeInstanceOf(
      AppointmentOutsideAllowedHoursError,
    )
  })

  it('should not create more than 20 appointments in a day', async () => {
    for (let i = 1; i <= 20; i++) {
      const data = mockCreateAppointmentUseCaseInput({
        appointmentDate: new Date(
          Date.UTC(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            15,
            9 + Math.floor(i / 2),
            0,
            0,
            0,
          ),
        ).getTime(),
      })
      await sut.execute(data)
    }

    await expect(() => {
      const newData = mockCreateAppointmentUseCaseInput({
        appointmentDate: new Date(
          Date.UTC(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            15,
            18,
          ),
        ).getTime(),
      })
      return sut.execute(newData)
    }).rejects.toBeInstanceOf(MaxNumberOfAppointmentsInSameDayError)
  })

  it('should not create more than 2 appointments in the same hour', async () => {
    for (let i = 1; i <= 2; i++) {
      const data = mockCreateAppointmentUseCaseInput({
        appointmentDate: new Date(
          Date.UTC(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            15,
            14,
            0,
            0,
          ),
        ).getTime(),
      })
      await sut.execute(data)
    }

    await expect(() => {
      const newData = mockCreateAppointmentUseCaseInput({
        appointmentDate: new Date(
          Date.UTC(
            new Date().getUTCFullYear(),
            new Date().getUTCMonth() + 1,
            15,
            14,
            0,
            0,
          ),
        ).getTime(),
      })
      return sut.execute(newData)
    }).rejects.toBeInstanceOf(MaxNumberOfAppointmentsInSameHourError)
  })
})
