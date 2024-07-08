import { describe, it, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { createAppointmentValidator } from '@/validators/create-appointment-validator'
import { format } from 'date-fns'

describe('createAppointmentValidator', () => {
  it('should validate a valid input', () => {
    const validName = faker.person.fullName()
    const validBirthDay = format(faker.date.past({ years: 20 }), 'yyyy-MM-dd')

    const validInput = { name: validName, birthDay: validBirthDay }

    const result = createAppointmentValidator.safeParse(validInput)
    expect(result.success).toEqual(true)
  })

  it('should reject an empty name', () => {
    const validBirthDay = format(faker.date.past({ years: 20 }), 'yyyy-MM-dd')
    const invalidInput = { name: '', birthDay: validBirthDay }
    const result = createAppointmentValidator.safeParse(invalidInput)

    expect(result.success).toEqual(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toEqual('Name must not be empty')
    }
  })

  it('should reject a missing name', () => {
    const validBirthDay = format(faker.date.past({ years: 20 }), 'yyyy-MM-dd')
    const invalidInput = { birthDay: validBirthDay }

    const result = createAppointmentValidator.safeParse(invalidInput)

    expect(result.success).toEqual(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toEqual('Name is required')
    }
  })

  it('should reject a non-string name', () => {
    const validBirthDay = format(faker.date.past({ years: 20 }), 'yyyy-MM-dd')
    const invalidInput = { name: 123, birthDay: validBirthDay }

    const result = createAppointmentValidator.safeParse(invalidInput)

    expect(result.success).toEqual(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toEqual('Name must be a string')
    }
  })

  it('should reject an invalid birthDay format', () => {
    const validName = faker.person.fullName()
    const invalidInput = { name: validName, birthDay: '20-05-2000' }

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
    const futureDate = format(faker.date.future(), 'yyyy-MM-dd')
    const invalidInput = { name: validName, birthDay: futureDate }

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
    const validInput = { name: validName, birthDay: validBirthDay }

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
})
