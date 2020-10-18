<script lang="ts">
  import type { Styles, Mode, Scene } from '../types';

  import { createAvatar } from '@dicebear/avatars';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import CreatorScene from './scenes/Creator.svelte';
  import DeterministicScene from './scenes/Deterministic.svelte';
  import ModeScene from './scenes/Mode.svelte';
  import StyleScene from './scenes/Style.svelte';

  export let mode: Mode = ['creator', 'deterministic'];
  export let styles: Styles;

  let scene = getInitialScene();
  let style = getInitialStyle();
  let options: any = {};
  let contentHeight = 0;

  $: backScene = getBackScene();
  $: avatar = style
    ? createAvatar(styles[style], {
        ...options,
        width: undefined,
        height: undefined,
        base64: true,
      })
    : undefined;

  function getPossibleModes() {
    return Array.isArray(mode) ? mode : [mode];
  }

  function changeScene(newScene: Scene) {
    scene = newScene;
  }

  function getInitialStyle(): string | undefined {
    let possibleModes = getPossibleModes();

    return possibleModes.length === 1 && Object.keys(styles).length === 1 ? Object.keys(styles)[0] : undefined;
  }

  function getInitialScene(): Scene {
    let possibleModes = getPossibleModes();

    if (possibleModes.length > 1) {
      return 'mode';
    } else if (Object.keys(styles).length > 1) {
      return 'style';
    } else {
      return possibleModes[0];
    }
  }

  function getBackScene(): Scene {
    let possibleModes = getPossibleModes();

    switch (scene) {
      case 'mode':
        return undefined;

      case 'style':
        return possibleModes.length > 1 ? 'mode' : undefined;
    }

    if (Object.keys(styles).length > 1) {
      return 'style';
    } else if (possibleModes.length > 1) {
      return 'mode';
    } else {
      return undefined;
    }
  }
</script>

<style>
  /** App (<= Fixes https://github.com/sveltejs/svelte/issues/4313) */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<div class="bg-gray-200 border-8 rounded-lg border-gray-200">
  <div class="h-16 flex items-start justify-between">
    <div class="flex">
      {#if backScene}
        <div class="mr-2">
          <Button on:click={() => changeScene(backScene)}>
            <Icon name="chevron-left" />
          </Button>
        </div>
      {/if}
    </div>
    <div class="flex">
      <div class="ml-2">
        <Button>
          <Icon name="refresh" />
        </Button>
      </div>
      <div class="ml-2">
        <Button>
          <Icon name="download" />
        </Button>
      </div>
    </div>
  </div>
  {#if avatar}
    <div class="text-center absolute left-0 right-0">
      <img
        src={avatar}
        class="w-32 h-32 -mt-16 inline-block border-2 border-white rounded-lg shadow-md bg-transparent-shape"
        alt="Your Avatar" />
    </div>
  {/if}
  <div class="rounded bg-white shadow-md relative">
    <div
      class="relative overflow-hidden transition-all ease-out duration-150"
      style="height: {contentHeight}px;">
      {#key scene}
        <div class="absolute top-0 left-0 right-0" bind:offsetHeight={contentHeight}>
          {#if scene === 'creator'}
            <CreatorScene />
          {:else if scene === 'deterministic'}
            <DeterministicScene />
          {:else if scene === 'mode'}
            <ModeScene />
          {:else if scene === 'style'}
            <StyleScene />
          {/if}
        </div>
      {/key}
    </div>
  </div>
</div>
<p class="text-right text-xs text-gray-400 pr-2 pt-1">
  Powered By
  <a href="https://avatars.dicebear.com" class="font-semibold hover:underline">DiceBear Avatars</a>
</p>
