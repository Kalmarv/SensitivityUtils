import { useState, useEffect } from 'react'
import { gamesList } from '../lib/games'
import { generateInGame, inGameToCMFixed } from '../lib/utils'
import { ReloadSVG } from '../components/ReloadSVG'
import {
  Title,
  UIContainer,
  Card,
  Select,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Stat,
  StatCenter,
  StatTitle,
  StatValue,
  StatDesc,
  Label,
} from '../styles/globals'
import { InputValue, SelectValue } from '../lib/types'

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
    <>
      <Title>Random Sensitivity</Title>

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
              <Label>DPI</Label>
              <Input
                value={dpi || ''}
                onChange={(e: InputValue) => setDPI(Number(e.target.value) || undefined)}
                type="number"
                placeholder="DPI"
              />
            </FormLabel>
            <FormLabel>
              <Label>Min</Label>
              <Input
                value={min || ''}
                onChange={(e: InputValue) => setMin(Number(e.target.value) || undefined)}
                type="number"
                placeholder="Minimum CM/360"
              />
            </FormLabel>
            <FormLabel>
              <Label>Max</Label>
              <Input
                value={max || ''}
                onChange={(e: InputValue) => setMax(Number(e.target.value) || undefined)}
                type="number"
                placeholder="Maximum CM/360"
              />
            </FormLabel>
          </FormControl>
        </Card>
        <Divider />
        <Card>
          <Stat>
            <StatCenter>
              <StatTitle>Your Sensitivity</StatTitle>
              <StatValue>{`${sens || '0.00'} in ${gamesList[inputGame].name}`}</StatValue>
              <StatDesc>{`${cm} CM/360`}</StatDesc>
            </StatCenter>
          </Stat>
          {/* IDK the idiomatic react way to call the same use effect on state change and button press */}
          <button onClick={() => setRegen(regen + 1)} className="btn mt-6 gap-2">
            Regenerate
            <ReloadSVG />
          </button>
        </Card>
      </UIContainer>
    </>
  )
}

export default Random
