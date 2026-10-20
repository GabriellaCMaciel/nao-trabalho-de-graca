const SEMANAS_POR_ANO = 52

/**
 * Quantas horas você realmente consegue COBRAR por ano.
 * Proposta, reunião, estudo e cliente que some não entram na conta, por isso o "% faturável".
 *
 * @param {object} p
 * @param {number} p.workDaysPerWeek
 * @param {number} p.hoursPerDay
 * @param {number} p.billablePercent  de 10 a 100
 * @param {number} p.vacationDays     dias úteis
 * @param {number} p.holidays         dias úteis
 * @param {number} p.sickDays
 */
export function calculateWorkload({
  workDaysPerWeek,
  hoursPerDay,
  billablePercent,
  vacationDays,
  holidays,
  sickDays,
}) {
  const workingDaysPerYear = Math.max(
    0,
    workDaysPerWeek * SEMANAS_POR_ANO - vacationDays - holidays - sickDays,
  )
  const billableHoursPerDay = hoursPerDay * (billablePercent / 100)
  const billableHoursPerYear = workingDaysPerYear * billableHoursPerDay

  return {
    workingDaysPerYear,
    billableHoursPerDay,
    billableHoursPerYear,
    billableHoursPerMonth: billableHoursPerYear / 12,
  }
}
