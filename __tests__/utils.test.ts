import { gamesList } from './../src/lib/games'
import { inGameToCM, cmToInGame, inGameToCMFixed, generateInGame, convertBetweenGames } from '../src/lib/utils'

import { expect, test } from 'vitest'

// Edit an assertion and save to see HMR in action

test('inGameToCM()', () => {
  expect(inGameToCM(6, 800, 0.0066)).toEqual(28.863636363636363)
  expect(inGameToCM(12, 400, 0.0066)).toEqual(28.863636363636363)
  expect(inGameToCM(3, 800, 0.022)).toEqual(17.31818181818182)
  expect(inGameToCM(6, 400, 0.022)).toEqual(17.31818181818182)
})

test('cmToInGame()', () => {
  expect(cmToInGame(28.863636363636363, 800, gamesList[0])).toEqual('6.00')
  expect(cmToInGame(28.863636363636363, 400, gamesList[0])).toEqual('12.00')
  expect(cmToInGame(17.31818181818182, 800, gamesList[2])).toEqual('3.00')
  expect(cmToInGame(17.31818181818182, 400, gamesList[2])).toEqual('6.00')
})

test('inGameToCMFixed()', () => {
  expect(inGameToCMFixed(6, 800, gamesList[0])).toEqual('28.86')
  expect(inGameToCMFixed(12, 400, gamesList[0])).toEqual('28.86')
  expect(inGameToCMFixed(3, 800, gamesList[2])).toEqual('17.32')
  expect(inGameToCMFixed(6, 400, gamesList[2])).toEqual('17.32')

  //@ts-expect-error
  expect(inGameToCMFixed('1', '400', gamesList[2])).toEqual('0.00')
})

test('generateInGame()', () => {
  const min = 20
  const max = 40
  const randomSens = Number(generateInGame(min, max, 800, gamesList[0]))

  expect(randomSens).toBeGreaterThanOrEqual(4.33)
  expect(randomSens).toBeLessThanOrEqual(8.66)

  expect(generateInGame(2, 1, 400, gamesList[0])).toBeUndefined()

  //@ts-expect-error
  expect(generateInGame('1', '2', 400, gamesList[0])).toBeUndefined()
})

test('convertBetweenGames()', () => {
  expect(convertBetweenGames(800, 6, 400, gamesList[0], gamesList[2])).toEqual('3.60')
  expect(convertBetweenGames(800, 12, 400, gamesList[0], gamesList[2])).toEqual('7.20')
  expect(convertBetweenGames(400, 3, 800, gamesList[2], gamesList[0])).toEqual('5.00')
  expect(convertBetweenGames(400, 6, 800, gamesList[2], gamesList[0])).toEqual('10.00')

  //@ts-expect-error
  expect(convertBetweenGames('800', '6', '400', gamesList[0], gamesList[2])).toEqual('')
})
