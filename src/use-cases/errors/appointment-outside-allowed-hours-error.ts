export class AppointmentOutsideAllowedHoursError extends Error {
  constructor() {
    super('Agendamentos só podem ser feitos entre 06:00 e 19:00')
  }
}
