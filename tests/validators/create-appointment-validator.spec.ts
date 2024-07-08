import { describe, it, expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { createAppointmentValidator } from '@/validators/create-appointment-validator'

describe('createAppointmentValidator', () => {
  it('should validate a valid input', () => {
    const validInput = { name: faker.person.fullName() }
    const result = createAppointmentValidator.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it('should reject an empty name', () => {
    const invalidInput = { name: '' }
    const result = createAppointmentValidator.safeParse(invalidInput)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name must not be empty')
    }
  })

  it('should reject a missing name', () => {
    const invalidInput = {}
    const result = createAppointmentValidator.safeParse(invalidInput)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name is required')
    }
  })

  it('should reject a non-string name', () => {
    const invalidInput = { name: 123 }
    const result = createAppointmentValidator.safeParse(invalidInput)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name must be a string')
    }
  })
})
