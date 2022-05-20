const inGameToCM = (sens: number, dpi: number, yaw: number): number => {
  return (360 * 2.54) / (sens * dpi * yaw)
}

const convertSensToAnother = (
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

const inGameToCMFixed = (sens: number, dpi: number, yaw: number): string => {
  if (typeof sens !== 'number' || typeof dpi !== 'number' || typeof yaw !== 'number') return
  return inGameToCM(sens, dpi, yaw).toFixed(2)
}

const generateInGame = (min: number, max: number, dpi: number, yaw: number, precision: number) => {
  const randBetweenRange = min + Math.random() * (max - min)
  const unRoundedSens = (360 * 2.54) / (randBetweenRange * dpi * yaw)
  const inGameSens = unRoundedSens.toFixed(precision)
  return inGameSens
}

export { inGameToCMFixed, convertSensToAnother, generateInGame }
