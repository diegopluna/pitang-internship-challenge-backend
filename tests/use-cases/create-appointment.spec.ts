import { InMemoryAppointmentsRepository } from '@/repositories/in-memory/in-memory-appointments-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateAppointmentUseCase } from '@/use-cases/create-appointment'
import { mockCreateAppointmentUseCaseInput } from '@tests/mocks/appointments-mocks'
import { AppointmentOutsideAllowedHoursError } from '@/use-cases/errors/appointment-outside-allowed-hours-error'
import { MaxNumberOfAppointmentsInSameDayError } from '@/use-cases/errors/max-number-of-appointments-in-same-day-error'
import { MaxNumberOfAppointmentsInSameHourError } from '@/use-cases/errors/max-number-of-appointments-in-same-hour'
import { createUTCDate } from '@/utils/date-utils'

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
    data.appointmentDate = createUTCDate({
      year: data.appointmentDate.getUTCFullYear(),
      month: data.appointmentDate.getUTCMonth(),
      day: data.appointmentDate.getUTCDate(),
      hour: 8,
      minute: 0,
      second: 0,
      millisecond: 0,
    })

    await expect(() => sut.execute(data)).rejects.toBeInstanceOf(
      AppointmentOutsideAllowedHoursError,
    )
  })

  it('should not create an appointment after 7pmBRT(10pm UTC)', async () => {
    const data = mockCreateAppointmentUseCaseInput()
    data.appointmentDate = createUTCDate({
      year: data.appointmentDate.getUTCFullYear(),
      month: data.appointmentDate.getUTCMonth(),
      day: data.appointmentDate.getUTCDate(),
      hour: 23,
      minute: 0,
      second: 0,
      millisecond: 0,
    })

    await expect(() => sut.execute(data)).rejects.toBeInstanceOf(
      AppointmentOutsideAllowedHoursError,
    )
  })

  it('should not create more than 20 appointments in a day', async () => {
    for (let i = 1; i <= 20; i++) {
      const data = mockCreateAppointmentUseCaseInput({
        appointmentDate: createUTCDate({
          year: new Date().getUTCFullYear(),
          month: new Date().getUTCMonth() + 1,
          day: 15,
          hour: 9 + Math.floor(i / 2),
        }).getTime(),
      })
      await sut.execute(data)
    }

    await expect(() => {
      const newData = mockCreateAppointmentUseCaseInput({
        appointmentDate: createUTCDate({
          year: new Date().getUTCFullYear(),
          month: new Date().getUTCMonth() + 1,
          day: 15,
          hour: 18,
        }).getTime(),
      })
      return sut.execute(newData)
    }).rejects.toBeInstanceOf(MaxNumberOfAppointmentsInSameDayError)
  })

  it('should not create more than 2 appointments in the same hour', async () => {
    for (let i = 1; i <= 2; i++) {
      const data = mockCreateAppointmentUseCaseInput({
        appointmentDate: createUTCDate({
          year: new Date().getUTCFullYear(),
          month: new Date().getUTCMonth() + 1,
          day: 15,
          hour: 14,
        }).getTime(),
      })
      await sut.execute(data)
    }

    await expect(() => {
      const newData = mockCreateAppointmentUseCaseInput({
        appointmentDate: createUTCDate({
          year: new Date().getUTCFullYear(),
          month: new Date().getUTCMonth() + 1,
          day: 15,
          hour: 14,
        }).getTime(),
      })
      return sut.execute(newData)
    }).rejects.toBeInstanceOf(MaxNumberOfAppointmentsInSameHourError)
  })
})
