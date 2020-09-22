<style global type="postcss">
  .vtrs {
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @responsive {
      .row {
        display: flex;
        margin: 0 -10px;
        flex-wrap: wrap;
      }

      .col-1 {
        width: calc(100% / 12 * 1);
        padding: 0 10px;
      }

      .col-2 {
        width: calc(100% / 12 * 2);
        padding: 0 10px;
      }

      .col-3 {
        width: calc(100% / 12 * 3);
        padding: 0 10px;
      }

      .col-4 {
        width: calc(100% / 12 * 4);
        padding: 0 10px;
      }

      .col-5 {
        width: calc(100% / 12 * 5);
        padding: 0 10px;
      }

      .col-6 {
        width: calc(100% / 12 * 6);
        padding: 0 10px;
      }

      .col-7 {
        width: calc(100% / 12 * 7);
        padding: 0 10px;
      }

      .col-8 {
        width: calc(100% / 12 * 8);
        padding: 0 10px;
      }

      .col-9 {
        width: calc(100% / 12 * 9);
        padding: 0 10px;
      }

      .col-10 {
        width: calc(100% / 12 * 10);
        padding: 0 10px;
      }

      .col-11 {
        width: calc(100% / 12 * 11);
        padding: 0 10px;
      }

      .col-12 {
        width: 100%;
        padding: 0 10px;
      }
    }
  }
</style>

<div class="vtrs">
  <slot />
</div>
