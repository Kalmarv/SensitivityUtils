<script lang="ts">
  import Home from './components/Home.svelte'
  import Current from './components/Current.svelte'

  let page = document.location.hash
  window.onpopstate = (event: PopStateEvent) => {
    page = document.location.hash
  }
</script>

<div class="drawer drawer-mobile">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col items-center justify-center">
    {#if page === '#home'}
      <Home />
    {:else if page === '#current'}
      <Current />
    {:else}
      <Home />
    {/if}

    <label for="my-drawer-2" class="btn btn-primary drawer-button lg:hidden">Open drawer</label>
  </div>
  <div class="drawer-side">
    <label for="my-drawer-2" class="drawer-overlay" />
    <ul class="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
      <!-- Sidebar content here -->
      <li><a href="#home">Home</a></li>
      <li><a href="#current">Current Sensitivity</a></li>
    </ul>
  </div>
</div>
