const realCM = (sens: number, dpi: number, yaw: number): number => {
  return (360 * 2.54) / (sens * dpi * yaw)
}

const convertSens = (
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

export { convertSens }
