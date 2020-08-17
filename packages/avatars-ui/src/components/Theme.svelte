<style global type="postcss">
  .vtrs {
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @extend .vtrs html;
  }
</style>

<div class="vtrs">
  <slot />
</div>
