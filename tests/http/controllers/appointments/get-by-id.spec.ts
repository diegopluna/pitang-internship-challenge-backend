import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { mockCreateAppointmentUseCaseInput } from '@tests/mocks/appointments-mocks'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { randomUUID } from 'crypto'

describe('Get Appointment By ID (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.appointment.deleteMany()
  })

  it('should be able to get an appointment by id', async () => {
    const appointmentData = mockCreateAppointmentUseCaseInput()
    const createdAppointment = await prisma.appointment.create({
      data: appointmentData,
    })

    const response = await request(app.server).get(
      `/api/appointments/${createdAppointment.id}`,
    )

    expect(response.status).toBe(200)
    expect(response.body.appointment).toEqual(
      expect.objectContaining({
        id: createdAppointment.id,
        name: appointmentData.name,
        birthDay: appointmentData.birthDay.toISOString(),
        appointmentDate: appointmentData.appointmentDate.toISOString(),
        vaccinationComplete: false,
      }),
    )
  })

  it('should return 404 when appointment is not found', async () => {
    const response = await request(app.server).get(
      `/api/appointments/${randomUUID()}`,
    )

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Recurso não encontrado')
  })

  it('should return 400 when id is invalid', async () => {
    const response = await request(app.server).get(
      '/api/appointments/invalid-id',
    )

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Erro de validação')
  })
})
