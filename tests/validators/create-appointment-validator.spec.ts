import { describe, it, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { createAppointmentValidator } from '@/validators/create-appointment-validator'
import { format } from 'date-fns'

describe('Create Appointment Validator', () => {
  it('should validate a valid input', () => {
    const validName = faker.person.fullName()
    const validBirthDay = format(faker.date.past({ years: 20 }), 'yyyy-MM-dd')
    const validAppointmentDate = faker.date.future().getTime()

    const validInput = {
      name: validName,
      birthDay: validBirthDay,
      appointmentDate: validAppointmentDate,
    }

    const result = createAppointmentValidator.safeParse(validInput)

    expect(result.success).toEqual(true)
  })

  it('should reject an empty name', () => {
    const validBirthDay = format(faker.date.past({ years: 20 }), 'yyyy-MM-dd')
    const validAppointmentDate = faker.date.future().getTime()

    const invalidInput = {
      name: '',
      birthDay: validBirthDay,
      appointmentDate: validAppointmentDate,
    }
    const result = createAppointmentValidator.safeParse(invalidInput)

    expect(result.success).toEqual(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toEqual('Name must not be empty')
    }
  })

  it('should reject a missing name', () => {
    const validBirthDay = format(faker.date.past({ years: 20 }), 'yyyy-MM-dd')
    const validAppointmentDate = faker.date.future().getTime()

    const invalidInput = {
      birthDay: validBirthDay,
      appointmentDate: validAppointmentDate,
    }

    const result = createAppointmentValidator.safeParse(invalidInput)

    expect(result.success).toEqual(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toEqual('Name is required')
    }
  })

  it('should reject a non-string name', () => {
    const validBirthDay = format(faker.date.past({ years: 20 }), 'yyyy-MM-dd')
    const validAppointmentDate = faker.date.future().getTime()

    const invalidInput = {
      name: 123,
      birthDay: validBirthDay,
      appointmentDate: validAppointmentDate,
    }

    const result = createAppointmentValidator.safeParse(invalidInput)

    expect(result.success).toEqual(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toEqual('Name must be a string')
    }
  })

  it('should reject an invalid birthDay format', () => {
    const validName = faker.person.fullName()
    const validAppointmentDate = faker.date.future().getTime()

    const invalidInput = {
      name: validName,
      birthDay: '20-05-2000',
      appointmentDate: validAppointmentDate,
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
    const validName = faker.person.fullName()
    const validAppointmentDate = faker.date.future().getTime()
    const futureDate = format(faker.date.future(), 'yyyy-MM-dd')
    const invalidInput = {
      name: validName,
      birthDay: futureDate,
      appointmentDate: validAppointmentDate,
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
    const validName = faker.person.fullName()
    const validBirthDay = format(faker.date.past({ years: 20 }), 'yyyy-MM-dd')
    const validAppointmentDate = faker.date.future().getTime()
    const validInput = {
      name: validName,
      birthDay: validBirthDay,
      appointmentDate: validAppointmentDate,
    }

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
    const validName = faker.person.fullName()
    const validBirthDay = format(faker.date.past({ years: 20 }), 'yyyy-MM-dd')

    const invalidInput = {
      name: validName,
      birthDay: validBirthDay,
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
    const validName = faker.person.fullName()
    const validBirthDay = format(faker.date.past({ years: 20 }), 'yyyy-MM-dd')
    const pastDate = faker.date.past().getTime()

    const invalidInput = {
      name: validName,
      birthDay: validBirthDay,
      appointmentDate: pastDate,
    }

    const result = createAppointmentValidator.safeParse(invalidInput)

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'The appointmentDate must be in the future.',
      )
    }
  })

  it('should transform appointmentDate to UTC Date object', () => {
    const validName = faker.person.fullName()
    const validBirthDay = format(faker.date.past({ years: 20 }), 'yyyy-MM-dd')
    const validAppointmentDate = faker.date.soon().getTime()
    const validInput = {
      name: validName,
      birthDay: validBirthDay,
      appointmentDate: validAppointmentDate,
    }

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
