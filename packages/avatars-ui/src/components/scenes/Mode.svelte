<script lang="ts">
  import type { Modes } from '../../types';

  export let modes: Modes;
</script>

<style>
  /** Scenes/Mode (<= Fixes https://github.com/sveltejs/svelte/issues/4313) */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<div class="p-12 flex justify-center">
  {#each modes as mode}
    <div>{mode}</div>
  {/each}
</div>
