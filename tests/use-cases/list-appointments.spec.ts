import { InMemoryAppointmentsRepository } from '@/repositories/in-memory/in-memory-appointments-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ListAppointmentsUseCase } from '@/use-cases/list-appointments'
import { mockCreateAppointmentUseCaseInput } from '@tests/mocks/appointments-mocks'

describe('List Appointments Use Case', () => {
  const appointmentsRepository = new InMemoryAppointmentsRepository()
  const sut = new ListAppointmentsUseCase(appointmentsRepository)

  beforeEach(() => {
    InMemoryAppointmentsRepository.appointments = []
  })

  it('should list appointments grouped by date and hour', async () => {
    const date1 = new Date(
      Date.UTC(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        15,
        10,
        0,
        0,
        0,
      ),
    )
    const date2 = new Date(
      Date.UTC(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        15,
        11,
        0,
        0,
        0,
      ),
    )

    const date3 = new Date(
      Date.UTC(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        16,
        10,
        0,
        0,
        0,
      ),
    )

    const appointment1 = mockCreateAppointmentUseCaseInput({
      appointmentDate: date1.getTime(),
    })
    const appointment2 = mockCreateAppointmentUseCaseInput({
      appointmentDate: date1.getTime(),
    })
    const appointment3 = mockCreateAppointmentUseCaseInput({
      appointmentDate: date2.getTime(),
    })
    const appointment4 = mockCreateAppointmentUseCaseInput({
      appointmentDate: date3.getTime(),
    })

    await appointmentsRepository.create(appointment1)
    await appointmentsRepository.create(appointment2)
    await appointmentsRepository.create(appointment3)
    await appointmentsRepository.create(appointment4)

    const { appointments } = await sut.execute()

    const formatDate = (date: Date) => date.toISOString().split('T')[0]
    const formatHour = (date: Date) =>
      `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`

    expect(appointments).toEqual({
      [formatDate(date1)]: {
        [formatHour(date1)]: [
          expect.objectContaining(appointment1),
          expect.objectContaining(appointment2),
        ],
        [formatHour(date2)]: [expect.objectContaining(appointment3)],
      },
      [formatDate(date3)]: {
        [formatHour(date3)]: [expect.objectContaining(appointment4)],
      },
    })
  })

  it('should return an empty object when there are no appointments', async () => {
    const { appointments } = await sut.execute()

    expect(appointments).toEqual({})
  })
})
