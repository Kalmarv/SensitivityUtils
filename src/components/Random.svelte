<script lang="ts">
  import { gamesList } from '../lib/games'
  import { generateInGame, inGameToCMFixed } from '../lib/utils'

  let inputGameID = 0
  let inputDPI: number | null = null
  let inputMin: number | null = null
  let inputMax: number | null = null

  let displayedSens: string = '0.00'
  let displayedCM: string = '0.00'

  const displayInfo = () => {
    const currentSens = generateInGame(inputMin, inputMax, inputDPI, selectedGame)
    const currentCM = inGameToCMFixed(Number(currentSens), inputDPI, selectedGame)
    if (!currentSens) return
    displayedSens = currentSens
    displayedCM = currentCM
  }

  $: selectedGame = gamesList[inputGameID]
  $: selectedGame, inputDPI, inputMin, inputMax, displayInfo()
</script>

<h1 class="text-center text-4xl m-8">Random Sensitivity</h1>

<div class="flex flex-col lg:flex-row mx-auto my-4">
  <div class="grid flex-grow card bg-base-200 rounded-box place-items-center p-8 shadow-lg">
    <!--  -->
    <select bind:value={inputGameID} class="select select-bordered w-full max-w-xs my-2 shadow-md">
      {#each gamesList as game}
        <option value={game.id}>{game.name}</option>
      {/each}
    </select>

    <div class="form-control my-2">
      <label class="input-group shadow-md">
        <span>DPI</span>
        <input bind:value={inputDPI} type="number" placeholder="DPI" class="input input-bordered" />
      </label>
    </div>
    <div class="form-control my-2">
      <label class="input-group shadow-md">
        <span>Min</span>
        <input bind:value={inputMin} type="number" placeholder="Minimum CM/360" class="input input-bordered" />
      </label>
    </div>
    <div class="form-control my-2">
      <label class="input-group shadow-md">
        <span>Max</span>
        <input bind:value={inputMax} type="number" placeholder="Maximum CM/360" class="input input-bordered" />
      </label>
    </div>
    <!--  -->
  </div>
  <div class="divider lg:divider-horizontal" />
  <div class="grid flex-grow card bg-base-200 rounded-box place-items-center p-8 shadow-lg">
    <!--  -->
    <div class="stats shadow-lg">
      <div class="stat place-items-center">
        <div class="stat-title">Your Sensitivity</div>
        <div class="stat-value text-primary mb-2">{`${displayedSens} in ${selectedGame.name}`}</div>
        <div class="stat-desc">{`${displayedCM ? displayedCM : '0.00'} CM/360`}</div>
      </div>
    </div>
    <button on:click={displayInfo} class="btn gap-2 mt-6">
      Regenerate
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise">
        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
      </svg>
    </button>
    <!--  -->
  </div>
</div>
