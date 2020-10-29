<script lang="ts">
  import type {
    Styles,
    Modes,
    Scene,
    Mode,
    StyleContext as _StyleContext, // <= Fix prettier parsing error
    OptionsContext,
    ModeContext,
    I18n,
    TransContext
  } from '../types';

  import type { Style } from '@dicebear/avatars';
  import { createAvatar } from '@dicebear/avatars';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import FormScene from './scenes/Form.svelte';
  import ModeScene from './scenes/Mode.svelte';
  import StyleScene from './scenes/Style.svelte';
  import { afterUpdate, getContext, setContext } from 'svelte';

  export let modes: Modes = ['creator'];
  export let styles: Styles;
  export let i18n: Partial<I18n> = {};

  let mode: Mode = modes[0];
  let style = styles[0];
  let scene = getPossibleScenes()[0];
  let options: any = {};
  let contentHeight = 0;
  let contentTransitions = false;

  $: trans = getContext<TransContext>('trans');
  $: backScene = getBackScene();
  $: avatar =
    scene === 'form'
      ? createAvatar(style, {
          ...options,
          width: undefined,
          height: undefined,
          base64: true,
        })
      : 'data:,';

  setContext<TransContext>('trans', {
    modeHeadline: 'Choose a mode',
    styleHeadline: 'Choose a style',
    creatorModeDescription: 'Create a individual avatar piece by piece.',
    deterministicModeDescription: 'Create deterministic avatars from a seed.',
    ...i18n,
  });

  setContext<ModeContext>('mode', {
    get: () => mode,
    set: changeMode,
  });

  setContext<_StyleContext>('style', {
    get: () => style,
    set: changeStyle,
  });

  setContext<OptionsContext>('options', {
    get: () => options,
    set: changeOptions,
  });

  afterUpdate(async () => {
    setTimeout(() => {
      contentTransitions = contentHeight > 0;
    }, 100);
  });

  function changeMode(newMode: Mode) {
    mode = newMode;
    scene = getPossibleScenes().filter((v) => v !== 'mode')[0];
    options = {};
  }

  function changeStyle(newStyle: Style<any>) {
    style = newStyle;
    scene = 'form';
    options = {};
  }

  function changeScene(newScene: Scene) {
    scene = newScene;
  }

  function changeOptions(newOptions: any) {
    options = newOptions;
  }

  function getPossibleScenes() {
    let scenes: Scene[] = [];

    if (modes.length > 1) {
      scenes.push('mode');
    }

    if (Object.keys(styles).length > 1) {
      scenes.push('style');
    }

    scenes.push('form');

    return scenes;
  }

  function getBackScene(): Scene {
    let possibleScenes = getPossibleScenes();
    let currentSceneIndex = possibleScenes.indexOf(scene);

    console.log(currentSceneIndex);

    return currentSceneIndex === 0 ? undefined : possibleScenes[currentSceneIndex - 1];
  }
</script>

<style>
  /** App (<= Fixes https://github.com/sveltejs/svelte/issues/4313) */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<div class="bg-gray-200 border-8 rounded-lg border-gray-200">
  <div class="h-10 flex mb-6">
    <div class="flex w-1/3">
      {#if backScene}
        <div class="mr-2">
          <Button on:click={() => changeScene(backScene)} icon="chevron-left" />
        </div>
      {/if}
    </div>
    <div class="w-1/3 flex justify-center items-end ">
      {#if scene === 'mode'}
        <h1 class="text-2xl text-gray-600">{trans.modeHeadline}</h1>
      {:else if scene === 'style'}
        <h1 class="text-2xl text-gray-600">{trans.styleHeadline}</h1>
      {:else if scene === 'form'}
        <div class="text-center left-0 right-0">
          <img
            src={avatar}
            class="w-32 h-32 -mt-16 inline-block border-2 border-white rounded-lg shadow-md bg-transparent-shape"
            alt="Your Avatar" />
        </div>
      {/if}
    </div>
    <div class="flex w-1/3 justify-end">
      {#if scene === 'form'}
        <div class="ml-2">
          <Button icon="refresh" />
        </div>
        <div class="ml-2">
          <Button icon="download" />
        </div>
      {/if}
    </div>
  </div>
  <div class="rounded bg-white shadow-md relative">
    <div
      class="relative overflow-hidden ${contentTransitions ? 'transition-all ease-out duration-150' : ''}"
      style="height: {contentHeight}px;">
      {#key scene}
        <div class="absolute top-0 left-0 right-0" bind:offsetHeight={contentHeight}>
          {#if scene === 'mode'}
            <ModeScene {modes} />
          {:else if scene === 'style'}
            <StyleScene />
          {:else if scene === 'form'}
            <FormScene />
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
