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

  it('should find all appointments', async () => {
    const appointment1 = mockCreateAppointmentUseCaseInput()
    const appointment2 = mockCreateAppointmentUseCaseInput()
    const appointment3 = mockCreateAppointmentUseCaseInput()

    await sut.create(appointment1)
    await sut.create(appointment2)
    await sut.create(appointment3)

    const result = await sut.findAll()

    expect(result).toHaveLength(3)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining(appointment1),
        expect.objectContaining(appointment2),
        expect.objectContaining(appointment3),
      ]),
    )
  })

  it('should return appointments sorted by appointmentDate', async () => {
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
        16,
        10,
        0,
        0,
        0,
      ),
    )
    const date3 = new Date(
      Date.UTC(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        17,
        10,
        0,
        0,
        0,
      ),
    )

    const appointment1 = mockCreateAppointmentUseCaseInput({
      appointmentDate: date2.getTime(),
    })
    const appointment2 = mockCreateAppointmentUseCaseInput({
      appointmentDate: date3.getTime(),
    })
    const appointment3 = mockCreateAppointmentUseCaseInput({
      appointmentDate: date1.getTime(),
    })

    await sut.create(appointment1)
    await sut.create(appointment2)
    await sut.create(appointment3)

    const result = await sut.findAll()

    expect(result).toHaveLength(3)
    expect(result[0].appointmentDate).toEqual(date1)
    expect(result[1].appointmentDate).toEqual(date2)
    expect(result[2].appointmentDate).toEqual(date3)
  })

  it('should return an empty array when there are no appointments', async () => {
    const result = await sut.findAll()

    expect(result).toEqual([])
  })

  it('should find an appointment by id', async () => {
    const appointment = mockCreateAppointmentUseCaseInput()
    const createdAppointment = await sut.create(appointment)

    const result = await sut.findById(createdAppointment.id)

    expect(result).toEqual(createdAppointment)
  })

  it('should return null when appointment is not found', async () => {
    const result = await sut.findById('non-existent-id')

    expect(result).toBeNull()
  })
})
