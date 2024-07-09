import request from 'supertest'
import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { mockCreateAppointmentUseCaseInput } from '@tests/mocks/appointments-mocks'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

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
    const date1 = new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth() + 1,
        15,
        10,
        0,
        0,
        0,
      ),
    )
    const date2 = new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth() + 1,
        15,
        11,
        0,
        0,
        0,
      ),
    )
    const date3 = new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth() + 1,
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

    await prisma.appointment.createMany({
      data: [appointment1, appointment2, appointment3, appointment4],
    })

    const response = await request(app.server).get('/api/appointments')

    const formatDate = (date: Date) => date.toISOString().split('T')[0]
    const formatHour = (date: Date) =>
      `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      appointments: {
        [formatDate(date1)]: {
          [formatHour(date1)]: expect.arrayContaining([
            expect.objectContaining({ name: appointment1.name }),
            expect.objectContaining({ name: appointment2.name }),
          ]),
          [formatHour(date2)]: [
            expect.objectContaining({ name: appointment3.name }),
          ],
        },
        [formatDate(date3)]: {
          [formatHour(date3)]: [
            expect.objectContaining({ name: appointment4.name }),
          ],
        },
      },
    })
  })

  it('should return an empty object when there are no appointments', async () => {
    const response = await request(app.server).get('/api/appointments')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ appointments: {} })
  })
})
