<script lang="ts">
  import { gamesList } from '../lib/games'
  import { convertBetweenGames, inGameToCMFixed } from '../lib/utils'

  let fromGameID = 0
  let toGameID = 1

  let fromDPI: number | null = null
  let fromSens: number | null = null
  let toDPI: number | null = null

  let newSens: string = '0.00'
  let newSensCM: string = '0.00'

  const displaySens = () => {
    const convertedSens = convertBetweenGames(fromDPI, fromSens, toDPI, selectedFromGame, selectedToGame)
    const convertedSensCm = inGameToCMFixed(Number(convertedSens), toDPI, selectedToGame)
    if (!convertedSens || !convertedSensCm) return
    newSens = convertedSens
    newSensCM = convertedSensCm
  }

  $: selectedFromGame = gamesList[fromGameID]
  $: selectedToGame = gamesList[toGameID]

  $: selectedFromGame, selectedToGame, fromDPI, fromSens, toDPI, displaySens()
</script>

<h1 class="text-center text-4xl m-8 font-bold">Convert Sens</h1>

<div class="flex flex-col lg:flex-row mx-auto my-4">
  <div class="grid flex-grow card bg-base-200 rounded-box place-items-center px-8 py-4 shadow-lg">
    <!--  -->
    <h1 class="text-secondary stat-value pb-4">From</h1>
    <select bind:value={fromGameID} class="select select-bordered w-full max-w-xs my-2 shadow-md">
      {#each gamesList as game}
        <option value={game.id}>{game.name}</option>
      {/each}
    </select>
    <div class="form-control my-2">
      <label class="input-group shadow-md">
        <span>In-Game Sens</span>
        <input bind:value={fromSens} type="number" placeholder="Sensitivity" class="input input-bordered" />
      </label>
    </div>

    <div class="form-control my-2">
      <label class="input-group shadow-md">
        <span>DPI</span>
        <input bind:value={fromDPI} type="number" placeholder="DPI" class="input input-bordered" />
      </label>
    </div>
    <!--  -->
  </div>
  <div class="divider lg:divider-horizontal" />
  <div class="grid flex-grow card bg-base-200 rounded-box place-items-center px-8 py-4 shadow-lg">
    <!--  -->
    <h1 class="text-secondary stat-value pb-4">To</h1>
    <select bind:value={toGameID} class="select select-bordered w-full max-w-xs my-2 shadow-md">
      {#each gamesList as game}
        <option value={game.id}>{game.name}</option>
      {/each}
    </select>

    <div class="form-control my-2">
      <label class="input-group shadow-md">
        <span>DPI</span>
        <input bind:value={toDPI} type="number" placeholder="DPI" class="input input-bordered" />
      </label>
    </div>
    <!--  -->
  </div>
  <div class="divider lg:divider-horizontal" />
  <div class="grid flex-grow card bg-base-200 rounded-box place-items-center p-8 shadow-lg">
    <!--  -->
    <div class="stats shadow-lg">
      <div class="stat place-items-center">
        <div class="stat-title">Your New Sensitivity</div>
        <div class="stat-value text-primary mb-2">{`${newSens} in ${selectedToGame.name}`}</div>
        <div class="stat-desc">{`${selectedFromGame.name} → ${selectedToGame.name}`}</div>
        <div class="stat-desc">{`DPI: ${fromDPI ? fromDPI : '0'} → ${toDPI ? toDPI : '0'}`}</div>
        <div class="stat-desc">{`${newSensCM} CM/360`}</div>
      </div>
    </div>
    <!--  -->
  </div>
</div>
