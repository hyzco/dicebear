<script lang="ts">
  import type { Mode, Context, Options } from '../types';

  import Button from './Button.svelte';
  import FormScene from './scenes/Form.svelte';
  import ModeScene from './scenes/Mode.svelte';
  import StyleScene from './scenes/Style.svelte';
  import { onMount, setContext } from 'svelte';
  import defaultLocales from '../locales';
  import { getBackScene, getPossibleScenes } from '../lib/scene';
  import { createPreviewAvatar } from '../lib/avatar';

  export let options: Options;

  let { styles, modes = ['creator'], locales = {}, locale = 'en_US', fallbackLocale = 'en_US' } = options;

  let mode: Mode = modes[0];
  let style = Object.values(styles)[0];
  let scene = getPossibleScenes(modes, styles)[0];
  let avatarOptions: any = {};
  let contentHeight = 0;
  let contentTransitions = false;
  let avatar: string | undefined;

  let i18n = {
    ...(defaultLocales[fallbackLocale] || {}),
    ...(defaultLocales[locale] || {}),
    ...(locales[fallbackLocale] || {}),
    ...(locales[locale] || {}),
  };

  let context: Context = {
    i18n: {
      get: (key) => i18n[key],
    },
    mode: {
      get: () => mode,
      set: (newMode) => {
        mode = newMode;
        scene = getPossibleScenes(modes, styles).filter((v) => v !== 'mode')[0];
        avatarOptions = {};
      },
    },
    style: {
      get: () => style,
      set: (newStyle) => {
        style = newStyle;
        scene = 'form';
        avatarOptions = {};
      },
    },
    avatarOptions: {
      get: () => avatarOptions,
      set: (newAvatarOptions) => (avatarOptions = newAvatarOptions),
    },
    scene: {
      get: () => scene,
      set: (newScene) => (scene = newScene),
    },
  };

  setContext('context', context);

  $: backScene = getBackScene(modes, styles, scene);
  $: avatar = createPreviewAvatar(style, avatarOptions);

  onMount(async () => {
    setTimeout(() => {
      contentTransitions = contentHeight > 0;
    }, 100);
  });
</script>

<style>
  /** App (<= Fixes https://github.com/sveltejs/svelte/issues/4313) */
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<div class="bg-gray-200 border-8 rounded-lg border-gray-200">
  <div class="h-10 flex h-16">
    <div class="flex w-1/3">
      {#if backScene}
        <div class="mr-2">
          <Button on:click={() => context.scene.set(backScene)} icon="chevron-left" />
        </div>
      {/if}
    </div>
    <div class="w-1/3 flex justify-center items-center whitespace-no-wrap">
      {#if scene === 'mode'}
        <h1 class="text-2xl text-gray-600 mb-2">{context.i18n.get('modeHeadline')}</h1>
      {:else if scene === 'style'}
        <h1 class="text-2xl text-gray-600 mb-2">{context.i18n.get('styleHeadline')}</h1>
      {:else if scene === 'form'}
        <div class="text-center left-0 right-0 self-start">
          <img
            src={avatar}
            class="w-32 h-auto max-w-full -mb-16 inline-block border-2 border-white rounded-lg shadow-md bg-transparent-shape z-10 relative"
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
        <div class="absolute top-0 left-0 right-0 p-6 sm:p-8 md:p-10 lg:p-12" bind:offsetHeight={contentHeight}>
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
