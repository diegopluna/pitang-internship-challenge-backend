export class MaxNumberOfAppointmentsInSameHourError extends Error {
  constructor() {
    super('Limite máximo de agendamentos por hora atingido')
  }
}
