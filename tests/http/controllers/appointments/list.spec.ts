import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { mockCreateAppointmentUseCaseInput } from '@tests/mocks/appointments-mocks'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { createUTCDate } from '@/utils/date-utils'

describe('List Appointments (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.appointment.deleteMany()
  })

  it('should list appointments grouped by date and hour', async () => {
    const date1 = createUTCDate({
      year: new Date().getUTCFullYear(),
      month: new Date().getUTCMonth() + 1,
      day: 15,
      hour: 10,
    })
    const date2 = createUTCDate({
      year: new Date().getUTCFullYear(),
      month: new Date().getUTCMonth() + 1,
      day: 15,
      hour: 11,
    })
    const date3 = createUTCDate({
      year: new Date().getUTCFullYear(),
      month: new Date().getUTCMonth() + 1,
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

    await prisma.appointment.createMany({
      data: [appointment1, appointment2, appointment3, appointment4],
    })

    const response = await request(app.server).get('/api/appointments')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      appointments: expect.arrayContaining([
        expect.objectContaining({ name: appointment1.name }),
        expect.objectContaining({ name: appointment2.name }),
        expect.objectContaining({ name: appointment3.name }),
        expect.objectContaining({ name: appointment4.name }),
      ]),
    })
  })

  it('should return an empty object when there are no appointments', async () => {
    const response = await request(app.server).get('/api/appointments')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ appointments: [] })
  })
})
