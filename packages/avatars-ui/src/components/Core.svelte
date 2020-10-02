<script lang="ts">
  import * as avatars from '@dicebear/avatars';
  import type { Mode, Styles } from '../types';
  import Button from './Button.svelte';
  import Card from './Card.svelte';
  import Select from './Select.svelte';

  export let mode: Mode;
  export let styles: Styles;

  let currentMode = Array.isArray(mode) ? mode[0] : mode;
  let currentStyle = Object.values(styles)[0];

  let avatar = avatars.createAvatar(styles['micah']);
</script>

<div class="flex flex-col md:flex-row w-full">
  <div class="md:w-44 flex-grow-0 mr-5 flex flex-col justify-between">
    <div>
      <Card class="mb-5">
        {@html avatar}
      </Card>
      <Select class="mb-1">
        {#each Object.keys(styles) as styleName}
          <option>{styleName}</option>
        {/each}
      </Select>
      <div class="text-center">
        <button class="text-xs text-gray-500 hover:underline">Switch to Creator Mode</button>
      </div>
    </div>
    <div>
      <Button variant="secondary" class="mb-2">Open in HTTP-API</Button>
      <Button variant="primary">Download SVG</Button>
    </div>
  </div>
  <div class="flex-grow">
    <Card class="h-full" />
  </div>
</div>
