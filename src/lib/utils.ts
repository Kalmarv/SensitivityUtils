import type { game } from './types'

const inGameToCM = (sens: number, dpi: number, yaw: number): number => {
  return (360 * 2.54) / (sens * dpi * yaw)
}

const cmToInGame = (cm360: number, dpi: number, game: game) => {
  const unRoundedSens = (360 * 2.54) / (cm360 * dpi * game.yaw)
  const inGameSens = unRoundedSens.toFixed(game.precision)
  return inGameSens
}

export const inGameToCMFixed = (sens: number, dpi: number, game: game): string => {
  if (typeof sens !== 'number' || typeof dpi !== 'number' || typeof game.yaw !== 'number') return
  return inGameToCM(sens, dpi, game.yaw).toFixed(2)
}

export const generateInGame = (min: number, max: number, dpi: number, game: game) => {
  if (typeof min !== 'number' || typeof max !== 'number' || typeof dpi !== 'number') return
  const randBetweenRange = min + Math.random() * (max - min)
  const inGameSens = cmToInGame(randBetweenRange, dpi, game)
  return inGameSens
}

export const convertBetweenGames = (
  dpiFrom: number,
  inGameFromSens: number,
  dpiTo: number,
  gameFrom: game,
  gameTo: game
): string => {
  const firstGameToCM = inGameToCM(inGameFromSens, dpiFrom, gameFrom.yaw)
  const cmtoSecondGame = cmToInGame(firstGameToCM, dpiTo, gameTo)
  return cmtoSecondGame
}
