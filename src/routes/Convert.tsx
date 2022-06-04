import { useState, useEffect } from 'react'
import { gamesList } from '../lib/games'
import { InputValue, SelectValue } from '../lib/types'
import { convertBetweenGames, inGameToCMFixed } from '../lib/utils'
import {
  Card,
  CardTitle,
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
      <Title>Convert Sens</Title>

      <UIContainer>
        <Card>
          <CardTitle>From</CardTitle>
          <Select value={gameFrom} onChange={(e: SelectValue) => setGameFrom(Number(e.target.value))}>
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
              />
            </FormLabel>
            <FormLabel>
              <Label>DPI</Label>
              <Input
                value={dpiFrom || ''}
                onChange={(e: InputValue) => setDpiFrom(Number(e.target.value) || undefined)}
                type="number"
                placeholder="DPI"
              />
            </FormLabel>
          </FormControl>
        </Card>
        <Divider />
        <Card>
          <CardTitle>To</CardTitle>
          <Select value={gameTo} onChange={(e: SelectValue) => setGameTo(Number(e.target.value))}>
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
                value={dpiTo || ''}
                onChange={(e: SelectValue) => setDpiTo(Number(e.target.value) || undefined)}
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
              <StatTitle>Your New Sensitivity</StatTitle>
              <StatValue id="sens">{`${newSens || '0.00'} in ${gamesList[gameTo].name}`}</StatValue>
              <StatDesc id="game">{`${gamesList[gameFrom].name} → ${gamesList[gameTo].name}`}</StatDesc>
              <StatDesc id="dpi">{`DPI: ${dpiFrom || '0'} → ${dpiTo || '0'}`}</StatDesc>
              <StatDesc id="cm">{`${newSensCM} CM/360`}</StatDesc>
            </StatCenter>
          </Stat>
        </Card>
      </UIContainer>
    </>
  )
}

export default Convert
