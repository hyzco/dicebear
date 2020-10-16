<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
</script>

<style>
  /** Button (<= Fixes https://github.com/sveltejs/svelte/issues/4313) */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<button
  class="flex items-center justify-center bg-white rounded hover:bg-gray-900 hover:text-white w-10 h-10 shadow-md focus:outline-none"
  on:click={() => dispatch('click')}>
  <slot />
</button>
