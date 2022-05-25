import { useState, useEffect } from 'react'
import { gamesList } from '../lib/games'
import { inGameToCMFixed } from '../lib/utils'

const Current = () => {
  const [inputGame, setInputGame] = useState(0)
  const [sens, setSens] = useState<number | undefined>(undefined)
  const [dpi, setDpi] = useState<number | undefined>(undefined)
  const [cm, setCm] = useState<number | string>('0.00')

  useEffect(() => {
    setCm(inGameToCMFixed(sens as number, dpi as number, gamesList[inputGame]))
  }, [inputGame, dpi, sens])

  return (
    <div>
      <h1 className="m-8 text-center text-4xl font-bold">Calculate CM/360</h1>

      <div className="mx-auto my-4 flex flex-col sm:max-w-lg lg:max-w-4xl lg:flex-row">
        <div className="card rounded-box grid flex-grow place-items-center bg-base-200 p-8 shadow-lg">
          <select
            onChange={(e) => setInputGame(Number(e.target.value))}
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
                value={dpi || ''}
                onChange={(e) => setDpi(Number(e.target.value) || undefined)}
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
              <div className="stat-title">Your Sensitivity</div>
              <div className="stat-value mb-2 text-primary">{`${cm} CM/360`}</div>
              <div className="stat-desc">{`In-Game Sens: ${sens ? sens : ''}`}</div>
              <div className="stat-desc">{`DPI: ${dpi ? dpi : '0'}`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Current
