interface game {
  id: number
  name: string
  yaw: number
  precision: number
}

const gamesList: game[] = [
  { id: 0, name: 'Overwatch', yaw: 0.0066, precision: 2 },
  { id: 1, name: 'Fortnite', yaw: 0.005555, precision: 3 },
  { id: 2, name: 'Counter Strike', yaw: 0.022, precision: 2 },
  { id: 3, name: 'Quake Champions', yaw: 0.022, precision: 6 },
]

export { gamesList }
