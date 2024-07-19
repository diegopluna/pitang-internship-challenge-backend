import { InMemoryAppointmentsRepository } from '@/repositories/in-memory/in-memory-appointments-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ListAppointmentsUseCase } from '@/use-cases/list-appointments'
import { mockCreateAppointmentUseCaseInput } from '@tests/mocks/appointments-mocks'
import { createUTCDate } from '@/utils/date-utils'

describe('List Appointments Use Case', () => {
  const appointmentsRepository = new InMemoryAppointmentsRepository()
  const sut = new ListAppointmentsUseCase(appointmentsRepository)

  beforeEach(() => {
    InMemoryAppointmentsRepository.appointments = []
  })

  it('should list all appointments', async () => {
    const date1 = createUTCDate({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: 15,
      hour: 10,
    })

    const date2 = createUTCDate({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: 15,
      hour: 11,
    })
    const date3 = createUTCDate({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: 16,
      hour: 10,
    })

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

    expect(appointments).toHaveLength(4)
    expect(appointments).toEqual(
      expect.arrayContaining([
        expect.objectContaining(appointment1),
        expect.objectContaining(appointment2),
        expect.objectContaining(appointment3),
        expect.objectContaining(appointment4),
      ]),
    )
  })

  it('should return an empty array when there are no appointments', async () => {
    const { appointments } = await sut.execute()

    expect(appointments).toEqual([])
  })
})
