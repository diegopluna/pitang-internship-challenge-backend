export class AppointmentOutsideAllowedHoursError extends Error {
  constructor() {
    super('Appointments can only be scheduled between 6am and 8pm')
  }
}
