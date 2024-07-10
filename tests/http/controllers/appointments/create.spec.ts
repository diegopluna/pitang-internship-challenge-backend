import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { mockCreateAppointmentControllerInput } from '@tests/mocks/appointments-mocks'
import { prisma } from '@/lib/prisma'

describe('Create Appointment (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    await prisma.appointment.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create an appointment', async () => {
    const appointmentData = mockCreateAppointmentControllerInput()

    const response = await request(app.server)
      .post('/api/appointments')
      .send(appointmentData)

    expect(response.statusCode).toEqual(201)
  })

  it('should return 400 for invalid input', async () => {
    const invalidData = {
      name: '',
      birthDay: 'invalid-date',
      appointmentDate: 'not-a-timestamp',
    }

    const response = await request(app.server)
      .post('/api/appointments')
      .send(invalidData)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe('Erro de validação')
  })

  it('should return 400 for appointment outside allowed hours', async () => {
    const appointmentData = mockCreateAppointmentControllerInput()
    const date = new Date(appointmentData.appointmentDate)
    date.setUTCHours(22)
    appointmentData.appointmentDate = date.getTime()

    const response = await request(app.server)
      .post('/api/appointments')
      .send(appointmentData)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe(
      'Agendamentos só podem ser feitos entre 06:00 e 20:00',
    )
  })

  it('should return 400 when max appointments per day is reached', async () => {
    const appointmentData = mockCreateAppointmentControllerInput()
    const date = new Date(appointmentData.appointmentDate)

    for (let i = 0; i < 20; i++) {
      date.setUTCHours(6 + Math.floor(i / 2))
      await prisma.appointment.create({
        data: {
          name: `Test User ${i}`,
          birthDay: new Date(appointmentData.birthDay),
          appointmentDate: date,
        },
      })
    }

    const response = await request(app.server)
      .post('/api/appointments')
      .send(appointmentData)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe(
      'Limite máximo de agendamentos diários atingido',
    )
  })

  it('should return 400 when max appointments per hour is reached', async () => {
    const appointmentData = mockCreateAppointmentControllerInput()
    const date = new Date(appointmentData.appointmentDate)

    for (let i = 0; i < 2; i++) {
      await prisma.appointment.create({
        data: {
          name: `Test User ${i}`,
          birthDay: new Date(appointmentData.birthDay),
          appointmentDate: date,
        },
      })
    }

    const response = await request(app.server)
      .post('/api/appointments')
      .send(appointmentData)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toBe(
      'Limite máximo de agendamentos por hora atingido',
    )
  })
})
