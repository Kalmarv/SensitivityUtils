<script lang="ts">
  import { gamesList } from '../lib/games'
  import { convertSensToCM } from '../lib/utils'

  let inputGameID = 0
  let inputDPI: number = null
  let inputSens: number = null
  let displayedSens: string = '0.00'

  const displaySens = () => {
    const currentSens = convertSensToCM(inputSens, inputDPI, selectedGame.yaw)
    if (!currentSens) return
    displayedSens = currentSens
  }

  $: selectedGame = gamesList[inputGameID]
  $: selectedGame, inputDPI, inputSens, displaySens()
</script>

<h1 class="text-center">Calculate CM/360</h1>

<select bind:value={inputGameID} class="select select-bordered w-full max-w-xs m-4">
  {#each gamesList as game}
    <option value={game.id}>{game.name}</option>
  {/each}
</select>

<input bind:value={inputDPI} type="number" placeholder="Sensitivity" class="input input-bordered w-full max-w-xs m-4" />
<input bind:value={inputSens} type="number" placeholder="DPI" class="input input-bordered w-full max-w-xs m-4" />

<div class="stats shadow">
  <div class="stat place-items-center">
    <div class="stat-title">Your Sensitivity</div>
    <div class="stat-value text-primary">{`${displayedSens} CM/360`}</div>
    <div class="stat-desc">{`In-Game Sens: ${inputSens}`}</div>
    <div class="stat-desc">{`DPI: ${inputDPI}`}</div>
  </div>
</div>
