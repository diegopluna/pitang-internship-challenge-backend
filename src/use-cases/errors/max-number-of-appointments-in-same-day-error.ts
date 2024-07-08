export class MaxNumberOfAppointmentsInSameDayError extends Error {
  constructor() {
    super('Maximum number of appointments reached for the day')
  }
}
