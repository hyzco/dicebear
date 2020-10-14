<script lang="ts">
  import Button from '@dicebear/avatars-ui/src/components/Button.svelte';
  import Icon from '@dicebear/avatars-ui/src/components/Icon.svelte';
  //import type { Mode, Styles } from '../types';

  //export let mode: Mode = ['creator', 'seed'];
  //export let styles: Styles;
</script>

<style src="../styles.css">
</style>

<div class="bg-gray-200 border-8 rounded-lg border-gray-200">
  <div class="h-16 flex items-start justify-between">
    <div class="flex">
      <div class="mr-2">
        <Button>
          <Icon name="chevron-left" />
        </Button>
      </div>
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
  <div class="text-center absolute left-0 right-0">
    <div class="w-32 h-32 -mt-16 inline-block border-2 border-white rounded-lg shadow-md" />
  </div>
  <div class="rounded bg-white shadow-md relative">
    <div class="text-center">
      <img
        src="https://avatars.dicebear.com/api/male/.svg"
        class="w-32 h-32 -mt-16 inline-block bg-transparent-shape border-2 border-white rounded-lg"
        alt="Your Avatar" />
    </div>
    <div class="grid grid-cols-parts gap-16 p-12">
      <div>
        <div class="text-center text-gray-600 text-sm">BASE</div>
        <div class="flex items-center pt-3">
          <div class="w-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-full">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div class="flex-grow"><img src="https://avatars.dicebear.com/api/male/.svg?b=%23fbefef" alt="" /></div>
          <div class="w-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              class="w-full">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
        <div class="grid grid-cols-colors gap-2 pt-4">
          <div>
            <div class="pt-full bg-red-300 rounded shadow" />
          </div>
          <div>
            <div class="relative pt-full bg-white rounded shadow">
              <div class="absolute inset-0 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="w-5">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <div class="pt-full bg-orange-300 rounded shadow" />
          </div>
          <div>
            <div class="pt-full bg-yellow-300 rounded shadow" />
          </div>
          <div>
            <div class="pt-full bg-green-300 rounded shadow" />
          </div>
          <div>
            <div class="pt-full bg-blue-300 rounded shadow" />
          </div>
          <div>
            <div class="pt-full bg-gray-300 rounded shadow" />
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<p class="text-right text-xs text-gray-400 pr-2 pt-1">
  Powered By
  <a href="https://avatars.dicebear.com" class="font-semibold hover:underline">DiceBear Avatars</a>
</p>
