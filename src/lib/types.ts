export interface game {
  id: number
  name: string
  yaw: number
  precision: number
}

export interface Row {
  id: number
  lower: number
  base: number
  higher: number
}

export interface psaValues {
  lower: number
  higher: number
}

export interface SelectValue {
  target: { value: Selection }
}

export interface InputValue {
  target: { value: InputEvent }
}
