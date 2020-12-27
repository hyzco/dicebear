# Changelog

## [5.0.0] - TBA

### Added

- `@dicebear/avatars-pixel-art`  
  Replacement for `male`, `female` and `human` avatar styles.

- `@dicebear/avatars-shapes`  
  Replacement for `jdenticon` avatar style.

- `@dicebear/avatars-micha`  
  New avatar style. Designed by [Micah Lanier](https://dribbble.com/micahlanier).

- `@dicebear/avatars-cli`  
  Official Dicebear Avatars CLI.

### Changed

- Package `@dicebear/avatars-avataaars-sprites` renamed to `@dicebear/avatars-avataaars`.

- Package `@dicebear/avatars-bottts-sprites` renamed to `@dicebear/avatars-bottts`.

- Package `@dicebear/avatars-gridy-sprites` renamed to `@dicebear/avatars-gridy`.

- Package `@dicebear/avatars-identicon-sprites` renamed to `@dicebear/avatars-identicon`.

- Package `@dicebear/avatars-initials-sprites` renamed to `@dicebear/avatars-initials`.

#### @dicebear/avatars

- Classes are rewritten as functions. This allows direct access to the `createAvatar` function without having to
  initialize an object first.

  Old API

  ```js
  import Avatars from `@dicebear/avatars`;
  import style from `@dicebear/avatars-identicon-sprites`;

  let options = {};
  let seed = 'custom-seed';
  let avatars = new Avatars(style, options);
  let svg = avatars.create(seed);
  ```

  New API

  ```js
  import { createAvatar } from `@dicebear/avatars`;
  import * as style from `@dicebear/avatars-identicon`;

  let svg = createAvatar(style, {
    seed: 'custom-seed',
    // ... and other options
  });
  ```

- The following options have been renamed:

  - `background` => `backgroundColor`

### Removed

- `@dicebear/avatars-male-sprites`  
  Use `@dicebear/avatars-pixel-art` instead.

- `@dicebear/avatars-female-sprites`  
  Use `@dicebear/avatars-pixel-art` instead.

- `@dicebear/avatars-human-sprites`  
  Use `@dicebear/avatars-pixel-art` instead.

- `@dicebear/avatars-jdenticon-sprites`  
  Use `@dicebear/avatars-shapes` instead.

#### @dicebear/avatars

- The following options have been removed:

  - `base64` => Use `dataUri` instead.

## Older Versions

- [4.x](https://github.com/DiceBear/avatars/blob/v4/CHANGELOG.md)
