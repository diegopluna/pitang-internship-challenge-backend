export class MaxNumberOfAppointmentsInSameDayError extends Error {
  constructor() {
    super('Limite máximo de agendamentos diários atingido')
  }
}
