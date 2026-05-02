export type TransactionType = 'buy' | 'sell'

export interface FeeSchedule {
  commissionRate: number
  minimumCommission: number
  vatRate: number
  pseTransactionRate: number
  sccpRate: number
  salesTaxRate: number
}

export interface FeeBreakdown {
  commission: number
  vat: number
  pseTransaction: number
  sccp: number
  salesTax: number
  totalFee: number
}

export interface PriceProfitSummary {
  buyFees: FeeBreakdown
  sellFees: FeeBreakdown
  buyTotalAmount: number
  sellTotalAmount: number
  averagePricePerShare: number
  breakEvenPrice: number
  brokerProfit: number
  brokerProfitPercent: number
  overallProfit: number
  overallProfitPercent: number
}

export interface BudgetPlan {
  boardLot: number
  shareCount: number
  totalFees: number
  totalAmount: number
  averagePricePerShare: number
  remainingBuyingPower: number
  breakEvenPrice: number
}

export interface BuyEntry {
  id: string
  shares: number
  buyPrice: number
}

export interface AggregatePosition {
  totalShares: number
  totalAmount: number
  averagePrice: number
}

interface RangeValue<T> {
  min: number
  max: number
  value: T
}

export const DEFAULT_FEE_SCHEDULE: FeeSchedule = {
  commissionRate: 0.0025,
  minimumCommission: 20,
  vatRate: 0.12,
  pseTransactionRate: 0.00005,
  sccpRate: 0.0001,
  salesTaxRate: 0.006,
}

const tickSizeTable: RangeValue<number>[] = [
  { min: 0.0001, max: 0.0099, value: 0.0001 },
  { min: 0.01, max: 0.049, value: 0.001 },
  { min: 0.05, max: 0.249, value: 0.001 },
  { min: 0.25, max: 0.495, value: 0.005 },
  { min: 0.5, max: 4.99, value: 0.01 },
  { min: 5, max: 9.99, value: 0.01 },
  { min: 10, max: 19.98, value: 0.02 },
  { min: 20, max: 49.95, value: 0.05 },
  { min: 50, max: 99.95, value: 0.05 },
  { min: 100, max: 199.9, value: 0.1 },
  { min: 200, max: 499.8, value: 0.2 },
  { min: 500, max: 999.5, value: 0.5 },
  { min: 1000, max: 1999, value: 1 },
  { min: 2000, max: 4998, value: 2 },
]

const boardLotTable: RangeValue<number>[] = [
  { min: 0.0001, max: 0.0099, value: 1_000_000 },
  { min: 0.01, max: 0.049, value: 100_000 },
  { min: 0.05, max: 0.249, value: 10_000 },
  { min: 0.25, max: 0.495, value: 10_000 },
  { min: 0.5, max: 4.99, value: 1_000 },
  { min: 5, max: 49.95, value: 100 },
  { min: 50, max: 999.5, value: 10 },
  { min: 1000, max: Number.POSITIVE_INFINITY, value: 5 },
]

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function lookupRangeValue<T>(table: RangeValue<T>[], price: number, fallback: T): T {
  const match = table.find((entry) => price >= entry.min && price <= entry.max)
  return match?.value ?? fallback
}

export function getTickSize(price: number): number {
  return lookupRangeValue(tickSizeTable, price, 5)
}

export function getBoardLot(price: number): number {
  return lookupRangeValue(boardLotTable, price, 5)
}

export function roundSharesToBoardLot(price: number, shares: number): number {
  const boardLot = getBoardLot(price)
  return Math.max(0, shares - (shares % boardLot))
}

export function calculateFeeBreakdown(
  price: number,
  shares: number,
  type: TransactionType,
  schedule: FeeSchedule = DEFAULT_FEE_SCHEDULE,
): FeeBreakdown {
  const grossAmount = price * shares
  const commission = Math.max(schedule.minimumCommission, grossAmount * schedule.commissionRate)
  const vat = commission * schedule.vatRate
  const pseTransaction = grossAmount * schedule.pseTransactionRate
  const sccp = grossAmount * schedule.sccpRate
  const salesTax = type === 'sell' ? grossAmount * schedule.salesTaxRate : 0
  const totalFee = commission + vat + pseTransaction + sccp + salesTax

  return {
    commission: roundCurrency(commission),
    vat: roundCurrency(vat),
    pseTransaction: roundCurrency(pseTransaction),
    sccp: roundCurrency(sccp),
    salesTax: roundCurrency(salesTax),
    totalFee: roundCurrency(totalFee),
  }
}

export function calculateTransactionTotal(
  price: number,
  shares: number,
  type: TransactionType,
  schedule: FeeSchedule = DEFAULT_FEE_SCHEDULE,
): number {
  const fees = calculateFeeBreakdown(price, shares, type, schedule)
  const grossAmount = price * shares

  if (type === 'buy') {
    return roundCurrency(grossAmount + fees.totalFee)
  }

  return roundCurrency(grossAmount - fees.totalFee)
}

export function calculateBreakEvenPrice(
  shares: number,
  buyPrice: number,
  schedule: FeeSchedule = DEFAULT_FEE_SCHEDULE,
): number {
  if (shares <= 0 || buyPrice <= 0) {
    return 0
  }

  const buyTotalAmount = calculateTransactionTotal(buyPrice, shares, 'buy', schedule)
  const averagePricePerShare = buyTotalAmount / shares

  return calculateBreakEvenPriceFromAmount(
    shares,
    averagePricePerShare,
    buyTotalAmount,
    buyPrice,
    schedule,
  )
}

export function calculateBreakEvenPriceFromAmount(
  shares: number,
  costBasisPerShare: number,
  targetAmount: number,
  startingSellPrice: number,
  schedule: FeeSchedule = DEFAULT_FEE_SCHEDULE,
): number {
  if (shares <= 0 || costBasisPerShare <= 0 || targetAmount <= 0 || startingSellPrice <= 0) {
    return 0
  }

  const tickSize = getTickSize(costBasisPerShare)

  let breakEvenPrice = startingSellPrice
  let sellTotalAmount = 0
  let safetyCounter = 0

  while (sellTotalAmount < targetAmount && safetyCounter < 100_000) {
    breakEvenPrice += tickSize
    sellTotalAmount = calculateTransactionTotal(breakEvenPrice, shares, 'sell', schedule)
    safetyCounter += 1
  }

  return Number(breakEvenPrice.toFixed(4))
}

export function calculatePriceProfitSummary(
  shares: number,
  buyPrice: number,
  sellPrice: number,
  schedule: FeeSchedule = DEFAULT_FEE_SCHEDULE,
): PriceProfitSummary {
  const buyFees = calculateFeeBreakdown(buyPrice, shares, 'buy', schedule)
  const sellFees = calculateFeeBreakdown(sellPrice, shares, 'sell', schedule)
  const buyTotalAmount = calculateTransactionTotal(buyPrice, shares, 'buy', schedule)
  const sellTotalAmount = calculateTransactionTotal(sellPrice, shares, 'sell', schedule)
  const averagePricePerShare = shares > 0 ? buyTotalAmount / shares : 0
  const breakEvenPrice = calculateBreakEvenPrice(shares, buyPrice, schedule)
  const brokerBasis = buyTotalAmount - buyFees.totalFee
  const brokerProfit = sellTotalAmount - brokerBasis
  const overallProfit = sellTotalAmount - buyTotalAmount
  const brokerProfitPercent = brokerBasis > 0 ? (sellTotalAmount / brokerBasis) * 100 - 100 : 0
  const overallProfitPercent = buyTotalAmount > 0 ? (sellTotalAmount / buyTotalAmount) * 100 - 100 : 0

  return {
    buyFees,
    sellFees,
    buyTotalAmount,
    sellTotalAmount,
    averagePricePerShare,
    breakEvenPrice,
    brokerProfit: roundCurrency(brokerProfit),
    brokerProfitPercent,
    overallProfit: roundCurrency(overallProfit),
    overallProfitPercent,
  }
}

export function calculateBudgetPlan(
  buyingPower: number,
  buyPrice: number,
  schedule: FeeSchedule = DEFAULT_FEE_SCHEDULE,
): BudgetPlan {
  if (buyingPower <= 0 || buyPrice <= 0) {
    return {
      boardLot: getBoardLot(Math.max(buyPrice, 0)),
      shareCount: 0,
      totalFees: 0,
      totalAmount: 0,
      averagePricePerShare: 0,
      remainingBuyingPower: buyingPower > 0 ? buyingPower : 0,
      breakEvenPrice: 0,
    }
  }

  const boardLot = getBoardLot(buyPrice)
  let shareCount = roundSharesToBoardLot(buyPrice, Math.floor(buyingPower / buyPrice))
  let totalAmount = calculateTransactionTotal(buyPrice, shareCount, 'buy', schedule)

  while (shareCount > 0 && totalAmount > buyingPower) {
    shareCount -= boardLot
    totalAmount = calculateTransactionTotal(buyPrice, shareCount, 'buy', schedule)
  }

  const totalFees = calculateFeeBreakdown(buyPrice, shareCount, 'buy', schedule).totalFee
  const averagePricePerShare = shareCount > 0 ? totalAmount / shareCount : 0
  const breakEvenPrice =
    shareCount > 0
      ? calculateBreakEvenPriceFromAmount(
          shareCount,
          averagePricePerShare,
          totalAmount,
          buyPrice,
          schedule,
        )
      : 0

  return {
    boardLot,
    shareCount,
    totalFees,
    totalAmount,
    averagePricePerShare,
    remainingBuyingPower: roundCurrency(buyingPower - totalAmount),
    breakEvenPrice,
  }
}

export function calculateAggregatePosition(
  entries: BuyEntry[],
  schedule: FeeSchedule = DEFAULT_FEE_SCHEDULE,
): AggregatePosition {
  const validEntries = entries.filter((entry) => entry.shares > 0 && entry.buyPrice > 0)
  const totalShares = validEntries.reduce((sum, entry) => sum + entry.shares, 0)
  const totalAmount = validEntries.reduce(
    (sum, entry) => sum + calculateTransactionTotal(entry.buyPrice, entry.shares, 'buy', schedule),
    0,
  )

  return {
    totalShares,
    totalAmount: roundCurrency(totalAmount),
    averagePrice: totalShares > 0 ? totalAmount / totalShares : 0,
  }
}

export function createBuyEntry(overrides?: Partial<BuyEntry>): BuyEntry {
  return {
    id: crypto.randomUUID(),
    shares: 0,
    buyPrice: 0,
    ...overrides,
  }
}
