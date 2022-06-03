import { useState, useEffect } from 'react'
import { gamesList } from '../lib/games'
import { InputValue, SelectValue } from '../lib/types'
import { inGameToCMFixed } from '../lib/utils'
import {
  Card,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Label,
  Select,
  Stat,
  StatCenter,
  StatDesc,
  StatTitle,
  StatValue,
  Title,
  UIContainer,
} from '../styles/globals'

const Current = () => {
  const [inputGame, setInputGame] = useState(0)
  const [sens, setSens] = useState<number | undefined>(undefined)
  const [dpi, setDpi] = useState<number | undefined>(undefined)
  const [cm, setCm] = useState<number | string>('0.00')

  useEffect(() => {
    setCm(inGameToCMFixed(sens as number, dpi as number, gamesList[inputGame]))
  }, [inputGame, dpi, sens])

  return (
    <>
      <Title>Calculate CM/360</Title>

      <UIContainer>
        <Card>
          <Select onChange={(e: SelectValue) => setInputGame(Number(e.target.value))}>
            {gamesList.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </Select>

          <FormControl>
            <FormLabel>
              <Label>In-Game Sens</Label>
              <Input
                value={sens || ''}
                onChange={(e: InputValue) => setSens(Number(e.target.value) || undefined)}
                type="number"
                placeholder="Sensitivity"
                className="input input-bordered"
              />
            </FormLabel>
            <FormLabel>
              <Label>DPI</Label>
              <Input
                value={dpi || ''}
                onChange={(e: InputValue) => setDpi(Number(e.target.value) || undefined)}
                type="number"
                placeholder="DPI"
              />
            </FormLabel>
          </FormControl>
        </Card>
        <Divider />
        <Card>
          <Stat>
            <StatCenter>
              <StatTitle>Your Sensitivity</StatTitle>
              <StatValue id="cm">{`${cm} CM/360`}</StatValue>
              <StatDesc id="sens">{`In-Game Sens: ${sens || ''}`}</StatDesc>
              <StatDesc id="dpi">{`DPI: ${dpi || '0'}`}</StatDesc>
            </StatCenter>
          </Stat>
        </Card>
      </UIContainer>
    </>
  )
}

export default Current
