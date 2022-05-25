import { useState, useEffect } from 'react'
import { gamesList } from '../lib/games'
import { generateInGame, inGameToCMFixed } from '../lib/utils'

const Random = () => {
  const [inputGame, setInputGame] = useState(0)
  const [dpi, setDPI] = useState<number | undefined>(undefined)
  const [min, setMin] = useState<number | undefined>(undefined)
  const [max, setMax] = useState<number | undefined>(undefined)
  const [cm, setCm] = useState<number | string>('0.00')
  const [sens, setSens] = useState<number | string | unknown>('0.00')
  const [regen, setRegen] = useState<number>(0)

  useEffect(() => {
    const currentSens = generateInGame(min as number, max as number, dpi as number, gamesList[inputGame])
    setSens(currentSens)
    if (currentSens) setCm(inGameToCMFixed(Number(currentSens), dpi as number, gamesList[inputGame]))
  }, [inputGame, dpi, min, max, regen])

  return (
    <div>
      <h1 className="m-8 text-center text-4xl font-bold">Random Sensitivity</h1>

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
              <span>DPI</span>
              <input
                value={dpi || ''}
                onChange={(e) => setDPI(Number(e.target.value) || undefined)}
                type="number"
                placeholder="DPI"
                className="input input-bordered"
              />
            </label>
          </div>
          <div className="form-control my-2">
            <label className="input-group shadow-md">
              <span>Min</span>
              <input
                value={min || ''}
                onChange={(e) => setMin(Number(e.target.value) || undefined)}
                type="number"
                placeholder="Minimum CM/360"
                className="input input-bordered"
              />
            </label>
          </div>
          <div className="form-control my-2">
            <label className="input-group shadow-md">
              <span>Max</span>
              <input
                value={max || ''}
                onChange={(e) => setMax(Number(e.target.value) || undefined)}
                type="number"
                placeholder="Maximum CM/360"
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
              <div className="stat-value mb-2 text-primary">{`${sens ? sens : '0.00'} in ${
                gamesList[inputGame].name
              }`}</div>
              <div className="stat-desc">{`${cm} CM/360`}</div>
            </div>
          </div>
          {/* IDK the idiomatic react way to call the same use effect on state change and button press */}
          <button onClick={() => setRegen(regen + 1)} className="btn mt-6 gap-2">
            Regenerate
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-clockwise"
            >
              <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Random
