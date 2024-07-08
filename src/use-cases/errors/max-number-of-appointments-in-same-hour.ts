export class MaxNumberOfAppointmentsInSameHourError extends Error {
  constructor() {
    super('Maximum number of appointments reached for the hour')
  }
}
