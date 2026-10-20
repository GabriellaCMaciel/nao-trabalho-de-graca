import { describe, it, expect } from 'vitest'
import { calculateWorkload } from './workload.js'

describe('calculateWorkload', () => {
  const base = {
    workDaysPerWeek: 5,
    hoursPerDay: 8,
    billablePercent: 60,
    vacationDays: 20,
    holidays: 10,
    sickDays: 5,
  }

  it('desconta férias, feriados e imprevistos dos dias úteis do ano', () => {
    const r = calculateWorkload(base)
    expect(r.workingDaysPerYear).toBe(225) // 5 × 52 − 35
  })

  it('só uma parte das horas é faturável', () => {
    const r = calculateWorkload(base)
    expect(r.billableHoursPerDay).toBeCloseTo(4.8)
    expect(r.billableHoursPerYear).toBeCloseTo(1080) // 225 × 4,8
    expect(r.billableHoursPerMonth).toBeCloseTo(90)
  })

  it('100% faturável usa todas as horas de trabalho', () => {
    const r = calculateWorkload({ ...base, billablePercent: 100 })
    expect(r.billableHoursPerYear).toBe(1800)
  })

  it('nunca devolve dias negativos', () => {
    const r = calculateWorkload({ ...base, workDaysPerWeek: 1, vacationDays: 100 })
    expect(r.workingDaysPerYear).toBe(0)
    expect(r.billableHoursPerYear).toBe(0)
  })
})
