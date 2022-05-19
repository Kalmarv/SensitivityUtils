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

<h1 class="text-center text-4xl m-8">Calculate CM/360</h1>

<div class="flex flex-col lg:flex-row mx-auto my-4">
  <div class="grid flex-grow card bg-base-200 rounded-box place-items-center p-8">
    <!--  -->
    <select bind:value={inputGameID} class="select select-bordered w-full max-w-xs my-2">
      {#each gamesList as game}
        <option value={game.id}>{game.name}</option>
      {/each}
    </select>
    <div class="form-control my-2">
      <label class="input-group">
        <span>In-Game Sens</span>
        <input bind:value={inputDPI} type="number" placeholder="Sensitivity" class="input input-bordered" />
      </label>
    </div>

    <div class="form-control my-2">
      <label class="input-group">
        <span>DPI</span>
        <input bind:value={inputSens} type="number" placeholder="DPI" class="input input-bordered" />
      </label>
    </div>
    <!--  -->
  </div>
  <div class="divider lg:divider-horizontal" />
  <div class="grid flex-grow card bg-base-200 rounded-box place-items-center p-8">
    <!--  -->
    <div class="stats shadow">
      <div class="stat place-items-center">
        <div class="stat-title">Your Sensitivity</div>
        <div class="stat-value text-primary">{`${displayedSens} CM/360`}</div>
        <div class="stat-desc">{`In-Game Sens: ${inputSens}`}</div>
        <div class="stat-desc">{`DPI: ${inputDPI}`}</div>
      </div>
    </div>
    <!--  -->
  </div>
</div>
