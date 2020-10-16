<script lang="ts">
  import type { Styles, Mode, Scene } from '../types';

  import { afterUpdate } from 'svelte';
  import { fly, fade } from 'svelte/transition';

  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import Layout from './Layout.svelte';
  import CreatorScene from './scenes/Creator.svelte';
  import ExpertScene from './scenes/Expert.svelte';
  import ModeScene from './scenes/Mode.svelte';
  import StyleScene from './scenes/Style.svelte';
import { createAvatar, micah } from '@dicebear/avatars';

  //export let mode: Mode = ['creator', 'seed'];
  //export let styles: Styles;

  let scene: Scene = 'mode';
  let content: HTMLDivElement;
  let contentScene: HTMLDivElement;
  $: contentHeight = content ? contentScene.offsetHeight : 0;

  function changeScene(newScene: Scene) {
    scene = newScene;
  }
</script>

<style>
  /** App (<= Fixes https://github.com/sveltejs/svelte/issues/4313) */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<Layout>
  <div class="flex" slot="buttonsLeft">
    <div class="mr-2">
      <Button on:click={() => changeScene('style')}>
        <Icon name="chevron-left" />
      </Button>
    </div>
  </div>

  <div class="flex" slot="buttonsRight">
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

  <div slot="content" class="relative overflow-hidden" bind:this={content} style="height: {contentHeight}px;">
    {#key scene}
      <div in:fly={{duration: 1000}} out:fade class="absolute top-0 left-0 right-0" bind:this={contentScene}>
        {#if scene === 'creator'}
          <CreatorScene />
        {:else if scene === 'expert'}
          <ExpertScene />
        {:else if scene === 'mode'}
          <ModeScene />
        {:else if scene === 'style'}
          <StyleScene />
        {/if}
      </div>
    {/key}
  </div>
</Layout>
