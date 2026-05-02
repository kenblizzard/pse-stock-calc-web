const integerFormatter = new Intl.NumberFormat('en-PH', {
  maximumFractionDigits: 0,
})

const moneyFormatter = new Intl.NumberFormat('en-PH', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatInteger(value: number): string {
  return integerFormatter.format(Number.isFinite(value) ? value : 0)
}

export function formatMoney(value: number): string {
  return moneyFormatter.format(Number.isFinite(value) ? value : 0)
}

export function formatPrice(value: number): string {
  if (!Number.isFinite(value)) {
    return '0.0000'
  }

  if (value < 0.01) {
    return value.toFixed(4)
  }

  if (value < 0.5) {
    return value.toFixed(3)
  }

  if (value < 100) {
    return value.toFixed(2)
  }

  if (value < 1000) {
    return value.toFixed(1)
  }

  return value.toFixed(0)
}

export function formatFixed(value: number, digits: number): string {
  if (!Number.isFinite(value)) {
    return (0).toFixed(digits)
  }

  return value.toFixed(digits)
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) {
    return '0.00%'
  }

  return `${value.toFixed(2)}%`
}
