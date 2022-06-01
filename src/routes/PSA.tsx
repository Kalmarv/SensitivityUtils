import { useEffect, useState } from 'react'
import { addRow } from '../lib/addRow'
import { Row } from '../lib/types'

const PSA = () => {
  const [sens, setSens] = useState<number | undefined>(undefined)
  const [rows, setRows] = useState<Row[]>([])
  const [finalSens, setFinalSens] = useState<number | null>(null)

  useEffect(() => {
    if (rows.length >= 7) {
      setFinalSens(rows[rows.length - 1].base)
    } else {
      setFinalSens(null)
    }
  }, [rows])

  return (
    <>
      <h1 className="m-8 text-center text-4xl font-bold">Perfect Sensitivity Approximation</h1>

      <div className="mx-auto my-4 flex flex-col lg:flex-row">
        <div className="card rounded-box grid flex-grow justify-items-center bg-base-200 px-8 py-4 shadow-lg">
          <div className="form-control my-2">
            <label className="input-group shadow-md">
              <span>Starting Sens</span>
              <input
                value={sens || ''}
                onChange={(e) => {
                  setSens(Number(e.target.value) || undefined)
                  setRows([
                    {
                      id: 0,
                      lower: Number(e.target.value) / 2,
                      base: Number(e.target.value),
                      higher: Number(e.target.value) * 1.5,
                    },
                  ])
                }}
                type="number"
                placeholder="Sensitivity"
                className="input input-bordered"
              />
            </label>
            <div className="flex justify-around ">
              <button onClick={() => setRows(addRow('lower', rows))} className="btn btn-primary mt-6">
                Lower
              </button>
              <button onClick={() => setRows(addRow('higher', rows))} className="btn btn-primary mt-6">
                Higher
              </button>
            </div>
          </div>
        </div>
        <div className="divider lg:divider-horizontal" />
        <div className="card rounded-box grid flex-grow place-items-center bg-base-200 px-8 py-4 shadow-lg">
          <div className="overflow-x-auto">
            <table className="table w-full mt-4">
              <thead>
                <tr>
                  <th className="bg-base-300"></th>
                  <th className="bg-base-300">Lower</th>
                  <th className="bg-base-300">Base</th>
                  <th className="bg-base-300">Higher</th>
                </tr>
              </thead>
              <tbody>
                {rows?.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id + 1}</td>
                    <td>{row.lower}</td>
                    <td>{row.base}</td>
                    <td>{row.higher}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {finalSens && (
              <div className="stat place-items-center">
                <div className="stat-title">Your Sensitivity</div>
                <div className="stat-value mb-2 text-primary">{finalSens}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default PSA
