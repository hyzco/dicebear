<script lang="ts">
  import type { IconName } from "@dicebear/avatars-ui/src/types";
  
  export let name: IconName;
  export let size: number = 24;
</script>

<style type="postcss" src="../style.css"></style>

<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width={size} height={size}>
  {#if name === 'refresh'}
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  {/if}
  
  {#if name === 'download'}
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  {/if}
    
  {#if name === 'chevron-left'}
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
  {/if}
    
  {#if name === 'chevron-right'}
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
  {/if}
  
  {#if name === 'check'}
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
  {/if}
</svg>
