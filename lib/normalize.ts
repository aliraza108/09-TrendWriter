type UnknownRecord = Record<string, unknown>

export function toRecord(value: unknown): UnknownRecord {
  return typeof value === 'object' && value !== null ? (value as UnknownRecord) : {}
}

export function toArray<T = UnknownRecord>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[]
  if (typeof value !== 'object' || value === null) return []

  const record = value as UnknownRecord
  const candidates = ['data', 'items', 'results', 'posts', 'variants', 'topics', 'calendar', 'recommendations', 'recommended_topics']
  for (const key of candidates) {
    const item = record[key]
    if (Array.isArray(item)) return item as T[]
  }
  return []
}

export function pickNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const cleaned = value.replace(/[,%]/g, '')
    const n = Number(cleaned)
    if (Number.isFinite(n)) return n
  }
  return fallback
}

export function pickString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}
