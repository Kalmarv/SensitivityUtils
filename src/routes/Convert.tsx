import { useState, useEffect } from 'react'
import { gamesList } from '../lib/games'
import { convertBetweenGames, inGameToCMFixed } from '../lib/utils'

const Convert = () => {
  const [gameFrom, setGameFrom] = useState(0)
  const [gameTo, setGameTo] = useState(1)
  const [sens, setSens] = useState<number | undefined>(undefined)
  const [dpiFrom, setDpiFrom] = useState<number | undefined>(undefined)
  const [dpiTo, setDpiTo] = useState<number | undefined>(undefined)
  const [newSens, setNewSens] = useState<number | string>('0.00')
  const [newSensCM, setNewSensCM] = useState<number | string>('0.00')

  useEffect(() => {
    const convertedSens = convertBetweenGames(
      dpiFrom as number,
      sens as number,
      dpiTo as number,
      gamesList[gameFrom],
      gamesList[gameTo]
    )
    const newSensCM = inGameToCMFixed(Number(convertedSens), dpiTo as number, gamesList[gameTo])
    setNewSens(convertedSens)
    setNewSensCM(newSensCM)
  }, [gameFrom, gameTo, sens, dpiFrom, dpiTo])

  return (
    <>
      <h1 className="m-8 text-center text-4xl font-bold">Convert Sens</h1>

      <div className="mx-auto my-4 flex flex-col lg:flex-row">
        <div className="card rounded-box grid flex-grow place-items-center bg-base-200 px-8 py-4 shadow-lg">
          <h1 className="stat-value pb-4 text-secondary">From</h1>
          <select
            value={gameFrom}
            onChange={(e) => setGameFrom(Number(e.target.value))}
            className="select select-bordered my-2 w-full max-w-xs shadow-md"
          >
            {gamesList.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
          <div className="form-control my-2">
            <label className="input-group shadow-md">
              <span>In-Game Sens</span>
              <input
                value={sens || ''}
                onChange={(e) => setSens(Number(e.target.value) || undefined)}
                type="number"
                placeholder="Sensitivity"
                className="input input-bordered"
              />
            </label>
          </div>

          <div className="form-control my-2">
            <label className="input-group shadow-md">
              <span>DPI</span>
              <input
                value={dpiFrom || ''}
                onChange={(e) => setDpiFrom(Number(e.target.value) || undefined)}
                type="number"
                placeholder="DPI"
                className="input input-bordered"
              />
            </label>
          </div>
        </div>
        <div className="divider lg:divider-horizontal" />
        <div className="card rounded-box grid flex-grow place-items-center bg-base-200 px-8 py-4 shadow-lg">
          <h1 className="stat-value pb-4 text-secondary">To</h1>
          <select
            value={gameTo}
            onChange={(e) => setGameTo(Number(e.target.value))}
            className="select select-bordered my-2 w-full max-w-xs shadow-md"
          >
            {gamesList.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>

          <div className="form-control my-2">
            <label className="input-group shadow-md">
              <span>DPI</span>
              <input
                value={dpiTo || ''}
                onChange={(e) => setDpiTo(Number(e.target.value) || undefined)}
                type="number"
                placeholder="DPI"
                className="input input-bordered"
              />
            </label>
          </div>
        </div>
        <div className="divider lg:divider-horizontal" />
        <div className="card rounded-box grid flex-grow place-items-center bg-base-200 p-8 shadow-lg">
          <div className="stats shadow-lg">
            <div className="stat place-items-center">
              <div className="stat-title">Your New Sensitivity</div>
              <div className="stat-value mb-2 text-primary">{`${newSens ? newSens : '0.00'} in ${
                gamesList[gameTo].name
              }`}</div>
              <div className="stat-desc">{`${gamesList[gameFrom].name} → ${gamesList[gameTo].name}`}</div>
              <div className="stat-desc">{`DPI: ${dpiFrom ? dpiFrom : '0'} → ${dpiTo ? dpiTo : '0'}`}</div>
              <div className="stat-desc">{`${newSensCM} CM/360`}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Convert
