import { InMemoryAppointmentsRepository } from '@/repositories/in-memory/in-memory-appointments-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateAppointmentUseCase } from '@/use-cases/update-appointment'
import { mockCreateAppointmentUseCaseInput } from '@tests/mocks/appointments-mocks'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { AppointmentOutsideAllowedHoursError } from '@/use-cases/errors/appointment-outside-allowed-hours-error'
import { MaxNumberOfAppointmentsInSameDayError } from '@/use-cases/errors/max-number-of-appointments-in-same-day-error'
import { MaxNumberOfAppointmentsInSameHourError } from '@/use-cases/errors/max-number-of-appointments-in-same-hour'
import { createUTCDate } from '@/utils/date-utils'

describe('Update Appointment Use Case', () => {
  const appointmentsRepository = new InMemoryAppointmentsRepository()
  const sut = new UpdateAppointmentUseCase(appointmentsRepository)

  beforeEach(() => {
    InMemoryAppointmentsRepository.appointments = []
  })

  it('should update an appointment', async () => {
    const appointmentData = mockCreateAppointmentUseCaseInput()
    const createdAppointment =
      await appointmentsRepository.create(appointmentData)

    const updatedData = {
      id: createdAppointment.id,
      name: 'Updated Name',
      birthDay: new Date('1990-01-01'),
      appointmentDate: createUTCDate({
        year: new Date().getUTCFullYear(),
        month: new Date().getUTCMonth(),
        day: new Date().getUTCDate() + 1,
        hour: 14,
      }),
      vaccinationComplete: true,
    }

    const { appointment } = await sut.execute(updatedData)

    expect(appointment).toEqual(expect.objectContaining(updatedData))
  })

  it('should throw ResourceNotFoundError if appointment does not exist', async () => {
    const nonExistentAppointment = {
      id: 'non-existent-id',
      name: 'Non-existent',
      birthDay: new Date(),
      appointmentDate: new Date(),
      vaccinationComplete: false,
    }

    await expect(() =>
      sut.execute(nonExistentAppointment),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should throw AppointmentOutsideAllowedHoursError if new appointment time is outside allowed hours', async () => {
    const appointmentData = mockCreateAppointmentUseCaseInput()
    const createdAppointment =
      await appointmentsRepository.create(appointmentData)

    const updatedData = {
      ...createdAppointment,
      appointmentDate: createUTCDate({
        year: new Date().getUTCFullYear(),
        month: new Date().getUTCMonth(),
        day: new Date().getUTCDate() + 1,
        hour: 23,
      }),
    }

    await expect(() => sut.execute(updatedData)).rejects.toBeInstanceOf(
      AppointmentOutsideAllowedHoursError,
    )
  })

  it('should throw MaxNumberOfAppointmentsInSameDayError if new date exceeds daily limit', async () => {
    for (let i = 0; i < 20; i++) {
      await appointmentsRepository.create(
        mockCreateAppointmentUseCaseInput({
          appointmentDate: createUTCDate({
            year: new Date().getUTCFullYear(),
            month: new Date().getUTCMonth() + 1,
            day: 15,
            hour: 9 + Math.floor(i / 2),
          }).getTime(),
        }),
      )
    }

    const appointmentToUpdate = mockCreateAppointmentUseCaseInput({
      appointmentDate: createUTCDate({
        year: new Date().getUTCFullYear(),
        month: new Date().getUTCMonth() + 1,
        day: 14,
        hour: 10,
      }).getTime(),
    })
    const createdAppointment =
      await appointmentsRepository.create(appointmentToUpdate)

    const updatedData = {
      ...createdAppointment,
      appointmentDate: createUTCDate({
        year: new Date().getUTCFullYear(),
        month: new Date().getUTCMonth() + 1,
        day: 15,
        hour: 10,
      }),
    }

    await expect(() => sut.execute(updatedData)).rejects.toBeInstanceOf(
      MaxNumberOfAppointmentsInSameDayError,
    )
  })

  it('should throw MaxNumberOfAppointmentsInSameHourError if new time exceeds hourly limit', async () => {
    const baseDate = createUTCDate({
      year: new Date().getUTCFullYear(),
      month: new Date().getUTCMonth(),
      day: new Date().getUTCDate() + 1,
      hour: 10,
    })

    for (let i = 0; i < 2; i++) {
      await appointmentsRepository.create(
        mockCreateAppointmentUseCaseInput({
          appointmentDate: baseDate.getTime(),
        }),
      )
    }

    const appointmentToUpdate = mockCreateAppointmentUseCaseInput({
      appointmentDate: new Date(baseDate.getTime() + 3600000).getTime(),
    })
    const createdAppointment =
      await appointmentsRepository.create(appointmentToUpdate)

    const updatedData = {
      ...createdAppointment,
      appointmentDate: baseDate,
    }

    await expect(() => sut.execute(updatedData)).rejects.toBeInstanceOf(
      MaxNumberOfAppointmentsInSameHourError,
    )
  })

  it('should not perform date checks if appointmentDate is not changed', async () => {
    const appointmentData = mockCreateAppointmentUseCaseInput()
    const createdAppointment =
      await appointmentsRepository.create(appointmentData)

    const updatedData = {
      ...createdAppointment,
      name: 'Updated Name',
    }

    const { appointment } = await sut.execute(updatedData)

    expect(appointment.name).toBe('Updated Name')
    expect(appointment.appointmentDate).toEqual(
      createdAppointment.appointmentDate,
    )
  })
})
