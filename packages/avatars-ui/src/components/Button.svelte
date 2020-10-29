<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { IconName } from '../types';
  import Icon from './Icon.svelte';

  export let icon: IconName | undefined = undefined;

  const dispatch = createEventDispatcher();
</script>

<style>
  /** Button (<= Fixes https://github.com/sveltejs/svelte/issues/4313) */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<button
  class="inline-flex items-center justify-center bg-white rounded hover:bg-gray-900 hover:text-white h-10 {icon ? 'w-10' : 'px-4'} shadow-md focus:outline-none"
  on:click={() => dispatch('click')}>
  {#if icon}
    <Icon name={icon} />
  {:else}
    <slot />
  {/if}
</button>
