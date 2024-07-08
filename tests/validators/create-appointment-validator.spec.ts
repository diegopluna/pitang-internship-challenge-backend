import { describe, it, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { createAppointmentValidator } from '@/validators/create-appointment-validator'
import { format } from 'date-fns'
import { mockCreateAppointmentControllerInput } from '@tests/mocks/appointments-mocks'

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
      expect(result.error.issues[0].message).toEqual('Name must not be empty')
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
      expect(result.error.issues[0].message).toEqual('Name is required')
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
      expect(result.error.issues[0].message).toEqual('Name must be a string')
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
        'Invalid date format. Expected format: YYYY-MM-DD',
      )
    }
  })

  it('should reject a future birthDay', () => {
    const invalidInput = {
      ...mockCreateAppointmentControllerInput(),
      birthDay: format(faker.date.future(), 'yyyy-MM-dd'),
    }

    const result = createAppointmentValidator.safeParse(invalidInput)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'The date must be in the past.',
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
        'Appointment date must be a number in Unix timestamp format',
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
        'The appointmentDate must be in the future. Make sure you are using Unix timestamp in milliseconds.',
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
