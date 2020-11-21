<script lang="ts">
  import type { Context } from '../../types';
  import { getContext } from 'svelte';
  import Deterministic from './Form/Deterministic.svelte';
  import Creator from './Form/Creator.svelte';

  const ctx = getContext<Context>('ctx');
</script>

<style>
  /** Scenes/Form (<= Fixes https://github.com/sveltejs/svelte/issues/4313) */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<div class="pt-16">
  {#if ctx.mode.get() === 'creator'}
    <Creator />
  {:else if ctx.mode.get() === 'deterministic'}
    <Deterministic />
  {/if}
</div>
