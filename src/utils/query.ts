import { z } from 'zod'

const numberQuerySchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === '') {
    return undefined
  }

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}, z.number().nonnegative().optional())

export function readOptionalNumberQuery(value: unknown): number | undefined {
  return numberQuerySchema.parse(value)
}
