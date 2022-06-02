import { Row } from './../src/lib/types'
import { addRow } from './../src/lib/addRow'
import { expect, test } from 'vitest'

test('inGameToCM()', () => {
  const baseRow = {
    id: 0,
    lower: 5,
    base: 10,
    higher: 15,
  }

  const fullTable = [baseRow, baseRow, baseRow, baseRow, baseRow, baseRow, baseRow]

  expect(addRow('lower', [baseRow])).toEqual([baseRow, { id: 1, lower: 3.75, base: 7.5, higher: 11.25 }])
  expect(addRow('higher', [baseRow])).toEqual([baseRow, { id: 1, lower: 6.25, base: 12.5, higher: 18.75 }])
  expect(addRow('', [baseRow])).toEqual([])
  expect(addRow('lower', [])).toEqual([])
  expect(addRow('higher', fullTable)).toEqual(fullTable)
})
