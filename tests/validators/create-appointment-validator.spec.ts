import { describe, it, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { createAppointmentValidator } from '@/validators/create-appointment-validator'
import { mockCreateAppointmentControllerInput } from '@tests/mocks/appointments-mocks'
import { formatDateToIsoDateString } from '@/utils/date-utils'

describe('Create Appointment Validator', () => {
  it('should validate a valid input', () => {
    const validInput = mockCreateAppointmentControllerInput()
    const result = createAppointmentValidator.safeParse(validInput)

    expect(result.success).toEqual(true)
  })

  it('should reject an empty name', () => {
    const invalidInput = {
      ...mockCreateAppointmentControllerInput(),
      name: '',
    }

    const result = createAppointmentValidator.safeParse(invalidInput)

    expect(result.success).toEqual(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toEqual('Nome não pode ser vazio')
    }
  })

  it('should reject a missing name', () => {
    const invalidInput = {
      ...mockCreateAppointmentControllerInput(),
      name: undefined,
    }

    const result = createAppointmentValidator.safeParse(invalidInput)

    expect(result.success).toEqual(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toEqual('Nome é obrigatório')
    }
  })

  it('should reject a non-string name', () => {
    const invalidInput = {
      ...mockCreateAppointmentControllerInput(),
      name: 123,
    }

    const result = createAppointmentValidator.safeParse(invalidInput)

    expect(result.success).toEqual(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toEqual('Nome deve ser uma string')
    }
  })

  it('should reject an invalid birthDay format', () => {
    const invalidInput = {
      ...mockCreateAppointmentControllerInput(),
      birthDay: '20-05-2000',
    }

    const result = createAppointmentValidator.safeParse(invalidInput)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Formato de data de aniversário inválido. Formato esperado: YYYY-MM-DD',
      )
    }
  })

  it('should reject a future birthDay', () => {
    const invalidInput = {
      ...mockCreateAppointmentControllerInput(),
      birthDay: formatDateToIsoDateString(faker.date.future()),
    }

    const result = createAppointmentValidator.safeParse(invalidInput)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'A data de aniversário deve ser anterior à data atual.',
      )
    }
  })

  it('should transform birthDay to UTC Date object', () => {
    const validInput = mockCreateAppointmentControllerInput()

    const result = createAppointmentValidator.safeParse(validInput)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.birthDay).toBeInstanceOf(Date)
      expect(result.data.birthDay.getUTCHours()).toBe(0)
      expect(result.data.birthDay.getUTCMinutes()).toBe(0)
      expect(result.data.birthDay.getUTCSeconds()).toBe(0)
      expect(result.data.birthDay.getUTCMilliseconds()).toBe(0)
    }
  })

  it('should reject an invalid appointmentDate format', () => {
    const invalidInput = {
      ...mockCreateAppointmentControllerInput(),
      appointmentDate: 'invalid-date',
    }

    const result = createAppointmentValidator.safeParse(invalidInput)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Data de agendamento deve ser um número no formato Unix timestamp',
      )
    }
  })

  it('should reject a past appointmentDate', () => {
    const invalidInput = {
      ...mockCreateAppointmentControllerInput(),
      appointmentDate: faker.date.past().getTime(),
    }

    const result = createAppointmentValidator.safeParse(invalidInput)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'A data de agendamento deve ser posterior à data e hora atual.',
      )
    }
  })

  it('should transform appointmentDate to UTC Date object', () => {
    const validInput = mockCreateAppointmentControllerInput()

    const result = createAppointmentValidator.safeParse(validInput)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.appointmentDate).toBeInstanceOf(Date)
      expect(result.data.appointmentDate.getUTCMinutes()).toBe(0)
      expect(result.data.appointmentDate.getUTCSeconds()).toBe(0)
      expect(result.data.appointmentDate.getUTCMilliseconds()).toBe(0)
    }
  })
})
