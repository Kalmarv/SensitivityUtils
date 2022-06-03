import { useEffect, useState } from 'react'
import { addRow } from '../lib/addRow'
import { Row, InputValue } from '../lib/types'
import {
  Card,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Label,
  StatCenter,
  StatTitle,
  StatValue,
  Title,
  UIContainer,
} from '../styles/globals'

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
      <Title>Perfect Sensitivity Approximation</Title>

      <UIContainer>
        <Card>
          <FormControl>
            <FormLabel>
              <Label>Starting Sens</Label>
              <Input
                value={sens || ''}
                onChange={(e: InputValue) => {
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
              />
            </FormLabel>
            <div className="flex justify-around ">
              <button onClick={() => setRows(addRow('lower', rows))} className="btn btn-primary mt-6">
                Lower
              </button>
              <button onClick={() => setRows(addRow('higher', rows))} className="btn btn-primary mt-6">
                Higher
              </button>
            </div>
          </FormControl>
        </Card>
        <Divider />
        <Card>
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
              <StatCenter>
                <StatTitle>Your Sensitivity</StatTitle>
                <StatValue>{finalSens}</StatValue>
              </StatCenter>
            )}
          </div>
        </Card>
      </UIContainer>
    </>
  )
}

export default PSA
