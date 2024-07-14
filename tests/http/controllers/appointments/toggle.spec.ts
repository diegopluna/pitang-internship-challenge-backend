import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { mockCreateAppointmentUseCaseInput } from '@tests/mocks/appointments-mocks'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { randomUUID } from 'crypto'

describe('Toggle Vaccinated (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.appointment.deleteMany()
  })

  it('should toggle vaccinated', async () => {
    const appointmentData = mockCreateAppointmentUseCaseInput()
    const createdAppointment = await prisma.appointment.create({
      data: appointmentData,
    })

    const response = await request(app.server).patch(
      `/api/appointments/${createdAppointment.id}/toggle-vaccinated`,
    )

    expect(response.status).toBe(204)

    const updatedAppointment = await prisma.appointment.findUnique({
      where: { id: createdAppointment.id },
    })

    expect(updatedAppointment?.vaccinationComplete).toBe(
      !createdAppointment.vaccinationComplete,
    )
  })

  it('should return 404 when appointment is not found', async () => {
    const response = await request(app.server).patch(
      `/api/appointments/${randomUUID()}/toggle-vaccinated`,
    )

    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Recurso não encontrado')
  })

  it('should return 400 when id is invalid', async () => {
    const response = await request(app.server).patch(
      '/api/appointments/invalid-id/toggle-vaccinated',
    )

    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Erro de validação')
  })
})
