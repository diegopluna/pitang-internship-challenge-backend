import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { mockCreateAppointmentUseCaseInput } from '@tests/mocks/appointments-mocks'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { randomUUID } from 'crypto'
import { createUTCDate, formatDateToIsoDateString } from '@/utils/date-utils'
import { faker } from '@faker-js/faker'

describe('Update Appointment (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.appointment.deleteMany()
  })

  it('should update an appointment', async () => {
    const appointmentData = mockCreateAppointmentUseCaseInput()
    const createdAppointment = await prisma.appointment.create({
      data: appointmentData,
    })

    const updatedData = {
      name: 'Updated Name',
      birthDay: new Date('1990-01-01').toISOString().split('T')[0],
      appointmentDate: createUTCDate({
        year: new Date().getUTCFullYear(),
        month: new Date().getUTCMonth(),
        day: new Date().getUTCDate() + 1,
        hour: 14,
      }).getTime(),
      vaccinationComplete: true,
    }

    const response = await request(app.server)
      .put(`/api/appointments/${createdAppointment.id}`)
      .send(updatedData)

    expect(response.status).toBe(204)

    const updatedAppointment = await prisma.appointment.findUnique({
      where: { id: createdAppointment.id },
    })

    expect(updatedAppointment).toEqual(
      expect.objectContaining({
        id: createdAppointment.id,
        name: updatedData.name,
        birthDay: new Date(updatedData.birthDay),
        appointmentDate: new Date(updatedData.appointmentDate),
        vaccinationComplete: updatedData.vaccinationComplete,
      }),
    )
  })

  it('should return 404 when appointment is not found', async () => {
    const updatedData = {
      name: faker.person.fullName(),
      birthDay: faker.date.birthdate().toISOString().split('T')[0],
      appointmentDate: faker.date.future().getTime(),
      vaccinationComplete: true,
    }

    const response = await request(app.server)
      .put(`/api/appointments/${randomUUID()}`)
      .send(updatedData)

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Recurso não encontrado')
  })

  it('should return 400 when input is invalid', async () => {
    const appointmentData = mockCreateAppointmentUseCaseInput()
    const createdAppointment = await prisma.appointment.create({
      data: appointmentData,
    })

    const invalidData = {
      name: '',
      birthDay: 'invalid-date',
      appointmentDate: 'not-a-timestamp',
      vaccinationComplete: 'not-a-boolean',
    }

    const response = await request(app.server)
      .put(`/api/appointments/${createdAppointment.id}`)
      .send(invalidData)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Erro de validação')
  })

  it('should return 400 for appointment outside allowed hours', async () => {
    const appointmentData = mockCreateAppointmentUseCaseInput()
    const createdAppointment = await prisma.appointment.create({
      data: appointmentData,
    })

    const updatedData = {
      ...appointmentData,
      birthDay: formatDateToIsoDateString(appointmentData.birthDay),
      appointmentDate: createUTCDate({
        year: new Date().getUTCFullYear(),
        month: new Date().getUTCMonth(),
        day: new Date().getUTCDate() + 1,
        hour: 23,
      }).getTime(),
      vaccinationComplete: true,
    }

    const response = await request(app.server)
      .put(`/api/appointments/${createdAppointment.id}`)
      .send(updatedData)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe(
      'Agendamentos só podem ser feitos entre 06:00 e 19:00',
    )
  })

  it('should return 400 when max appointments per day is reached', async () => {
    const appointmentData = mockCreateAppointmentUseCaseInput()
    const date = appointmentData.appointmentDate

    const createdAppointment = await prisma.appointment.create({
      data: {
        ...appointmentData,
        appointmentDate: createUTCDate({
          year: new Date().getUTCFullYear(),
          month: new Date().getUTCMonth() + 1,
          day: 14,
          hour: 9,
        }),
      },
    })
    const nextDay = createUTCDate({
      year: new Date().getUTCFullYear(),
      month: new Date().getUTCMonth() + 1,
      day: 15,
      hour: 9,
    })

    for (let i = 0; i < 20; i++) {
      date.setUTCHours(9 + Math.floor(i / 2))
      await prisma.appointment.create({
        data: {
          ...mockCreateAppointmentUseCaseInput(),
          appointmentDate: nextDay,
        },
      })
    }

    nextDay.setUTCHours(20)
    const updatedData = {
      ...appointmentData,
      birthDay: formatDateToIsoDateString(appointmentData.birthDay),
      appointmentDate: nextDay.getTime(),
      vaccinationComplete: true,
    }

    const response = await request(app.server)
      .put(`/api/appointments/${createdAppointment.id}`)
      .send(updatedData)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe(
      'Limite máximo de agendamentos diários atingido',
    )
  })

  it('should return 400 when max appointments per hour is reached', async () => {
    const appointmentData = mockCreateAppointmentUseCaseInput()
    const createdAppointment = await prisma.appointment.create({
      data: {
        ...appointmentData,
        appointmentDate: createUTCDate({
          year: new Date().getUTCFullYear(),
          month: new Date().getUTCMonth() + 1,
          day: 14,
          hour: 10,
        }),
      },
    })

    const nextDay = createUTCDate({
      year: new Date().getUTCFullYear(),
      month: new Date().getUTCMonth() + 1,
      day: 15,
      hour: 10,
    })

    for (let i = 0; i < 2; i++) {
      await prisma.appointment.create({
        data: {
          ...mockCreateAppointmentUseCaseInput(),
          appointmentDate: nextDay,
        },
      })
    }

    const updatedData = {
      ...appointmentData,
      birthDay: formatDateToIsoDateString(appointmentData.birthDay),
      appointmentDate: nextDay.getTime(),
      vaccinationComplete: true,
    }

    const response = await request(app.server)
      .put(`/api/appointments/${createdAppointment.id}`)
      .send(updatedData)

    expect(response.status).toBe(400)
    expect(response.body.message).toBe(
      'Limite máximo de agendamentos por hora atingido',
    )
  })
})
