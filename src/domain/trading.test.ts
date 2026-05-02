import { describe, expect, it } from 'vitest'
import {
  calculateAggregatePosition,
  calculateBreakEvenPrice,
  calculateBudgetPlan,
  calculateFeeBreakdown,
  calculatePriceProfitSummary,
  calculateTransactionTotal,
  getBoardLot,
  getTickSize,
} from './trading'

describe('trading rules', () => {
  it('calculates buy and sell fees with the expected tax rules', () => {
    expect(calculateFeeBreakdown(10, 100, 'buy')).toEqual({
      commission: 20,
      vat: 2.4,
      pseTransaction: 0.05,
      sccp: 0.1,
      salesTax: 0,
      totalFee: 22.55,
    })

    expect(calculateFeeBreakdown(10, 100, 'sell')).toEqual({
      commission: 20,
      vat: 2.4,
      pseTransaction: 0.05,
      sccp: 0.1,
      salesTax: 1,
      totalFee: 23.55,
    })
  })

  it('applies board lot and tick size lookups', () => {
    expect(getBoardLot(4.99)).toBe(1000)
    expect(getBoardLot(50)).toBe(10)
    expect(getTickSize(0.0099)).toBe(0.0001)
    expect(getTickSize(25)).toBe(0.05)
  })

  it('computes transaction totals and break-even price', () => {
    expect(calculateTransactionTotal(10, 100, 'buy')).toBe(1022.55)
    expect(calculateTransactionTotal(10, 100, 'sell')).toBe(976.45)
    expect(calculateBreakEvenPrice(100, 10)).toBe(10.48)
  })

  it('builds a budget plan using board-lot rounding', () => {
    expect(calculateBudgetPlan(5000, 12)).toEqual({
      boardLot: 100,
      shareCount: 400,
      totalFees: 23.12,
      totalAmount: 4823.12,
      averagePricePerShare: 12.0578,
      remainingBuyingPower: 176.88,
      breakEvenPrice: 12.14,
    })
  })

  it('summarizes price and profit results', () => {
    const summary = calculatePriceProfitSummary(100, 10, 12)

    expect(summary.buyTotalAmount).toBe(1022.55)
    expect(summary.sellTotalAmount).toBe(1176.22)
    expect(summary.breakEvenPrice).toBe(10.48)
    expect(summary.brokerProfit).toBe(176.22)
    expect(summary.overallProfit).toBe(153.67)
  })

  it('aggregates multiple buy entries with fees included', () => {
    expect(
      calculateAggregatePosition([
        { id: '1', shares: 100, buyPrice: 10 },
        { id: '2', shares: 200, buyPrice: 12 },
      ]),
    ).toEqual({
      totalShares: 300,
      totalAmount: 3445.31,
      averagePrice: 11.484366666666668,
    })
  })
})
