const realCM = (sens: number, dpi: number, yaw: number): number => {
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
  const realSens = realCM(Number(sensTo), dpiTo, yawTo).toFixed(2)
  return realSens
}

const convertSensToCM = (sens: number, dpi: number, yaw: number): string => {
  if (typeof sens !== 'number' || typeof dpi !== 'number' || typeof yaw !== 'number') return
  return realCM(sens, dpi, yaw).toFixed(2)
}

export { convertSensToCM, convertSensToAnother }
