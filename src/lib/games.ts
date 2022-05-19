interface game {
  name: string
  yaw: number
  precision: number
}

const gamesList: game[] = [
  { name: 'Overwatch', yaw: 0.0066, precision: 2 },
  { name: 'Fortnite', yaw: 0.005555, precision: 3 },
  { name: 'CounterStrike', yaw: 0.022, precision: 2 },
  { name: 'QuakeChampions', yaw: 0.022, precision: 6 },
]

export { gamesList }
