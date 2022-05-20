import type { game } from './types'

const inGameToCM = (sens: number, dpi: number, yaw: number): number => {
  return (360 * 2.54) / (sens * dpi * yaw)
}

export const convertSensToAnother = (
  dpiFrom: number,
  sensFrom: number,
  yawFrom: number,
  dpiTo: number,
  yawTo: number,
  precisionFrom: number
): string => {
  const tempSens = (dpiFrom * sensFrom * yawFrom) / (dpiTo * yawTo)
  const sensTo = tempSens.toFixed(precisionFrom)
  const realSens = inGameToCM(Number(sensTo), dpiTo, yawTo).toFixed(2)
  return realSens
}

export const inGameToCMFixed = (sens: number, dpi: number, game: game): string => {
  if (typeof sens !== 'number' || typeof dpi !== 'number' || typeof game.yaw !== 'number') return
  return inGameToCM(sens, dpi, game.yaw).toFixed(2)
}

export const generateInGame = (min: number, max: number, dpi: number, game: game) => {
  if (typeof min !== 'number' || typeof max !== 'number' || typeof dpi !== 'number') return
  const randBetweenRange = min + Math.random() * (max - min)
  const unRoundedSens = (360 * 2.54) / (randBetweenRange * dpi * game.yaw)
  const inGameSens = unRoundedSens.toFixed(game.precision)
  return inGameSens
}
