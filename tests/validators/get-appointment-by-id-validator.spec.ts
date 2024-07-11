import { describe, it, expect } from 'vitest'
import { getAppointmentByIdValidator } from '@/validators/get-appointment-by-id-validator'
import { faker } from '@faker-js/faker'

describe('Get Appointment By ID Validator', () => {
  it('should validate a valid UUID', () => {
    const validUUID = faker.string.uuid()
    const result = getAppointmentByIdValidator.safeParse({ id: validUUID })

    expect(result.success).toBe(true)
  })

  it('should reject an invalid UUID', () => {
    const invalidUUID = 'not-a-uuid'
    const result = getAppointmentByIdValidator.safeParse({ id: invalidUUID })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('ID inválido')
    }
  })

  it('should reject a missing ID', () => {
    const result = getAppointmentByIdValidator.safeParse({})

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('ID é obrigatório')
    }
  })

  it('should reject a non-string ID', () => {
    const result = getAppointmentByIdValidator.safeParse({ id: 123 })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('ID é obrigatório')
    }
  })
})
