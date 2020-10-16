<script lang="ts">
  //import type { Mode, Styles } from '../types';

  //export let mode: Mode = ['creator', 'seed'];
  //export let styles: Styles;
</script>

<style>
  /** Scene (<= Fixes https://github.com/sveltejs/svelte/issues/4313) */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<div class="bg-gray-200 border-8 rounded-lg border-gray-200">
  <div class="h-16 flex items-start justify-between">
    <slot name="buttonsLeft" />
    <slot name="buttonsRight" />
  </div>
  <div class="text-center absolute left-0 right-0">
    <div class="w-32 h-32 -mt-16 inline-block border-2 border-white rounded-lg shadow-md" />
  </div>
  <div class="rounded bg-white shadow-md relative">
    <slot name="content" />
  </div>
</div>
<p class="text-right text-xs text-gray-400 pr-2 pt-1">
  Powered By
  <a href="https://avatars.dicebear.com" class="font-semibold hover:underline">DiceBear Avatars</a>
</p>
