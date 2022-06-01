import { iterations } from './iterations'
import { Row } from './types'

export const addRow = (choice: string, rows: Row[]): Row[] => {
  if (rows?.length === 0 || !rows) return []
  if (rows.length >= 7) return rows

  const lastRow = rows[rows.length - 1]

  if (choice === 'lower') {
    const newBase = Number(((lastRow.base + lastRow.lower) * 0.5).toFixed(2))
    const newLower = Number((newBase * iterations[lastRow.id].lower).toFixed(2))
    const newHigher = Number((newBase * iterations[lastRow.id].higher).toFixed(2))

    return [...rows, { id: lastRow.id + 1, lower: newLower, base: newBase, higher: newHigher }]
  }
  if (choice === 'higher') {
    const newBase = Number(((lastRow.base + lastRow.higher) * 0.5).toFixed(2))
    const newLower = Number((newBase * iterations[lastRow.id].lower).toFixed(2))
    const newHigher = Number((newBase * iterations[lastRow.id].higher).toFixed(2))

    return [...rows, { id: lastRow.id + 1, lower: newLower, base: newBase, higher: newHigher }]
  }
  // why typescript
  return []
}
