# Changelog

## [5.0.0] - TBA

### Changed

#### General

- The packages are now provided under the namespace `@avatars`. And the avatar styles `male`, `female` and `human` have been combined under `pixel-art`. This results in the following changes.

| Old package name                      | New package name              |
| ------------------------------------- | ----------------------------- |
| `@dicebear/avatars`                   | `@dicebear/avatars`           |
| `@dicebear/avatars-avataaars-sprites` | `@dicebear/avatars-avataaars` |
| `@dicebear/avatars-bottts-sprites`    | `@dicebear/avatars-bottts`    |
| `@dicebear/avatars-code-sprites`      | `@dicebear/avatars-code`      |
| `@dicebear/avatars-female-sprites`    | `@dicebear/avatars-pixel-art` |
| `@dicebear/avatars-gridy-sprites`     | `@dicebear/avatars-gridy`     |
| `@dicebear/avatars-human-sprites`     | `@dicebear/avatars-pixel-art` |
| `@dicebear/avatars-identicon-sprites` | `@dicebear/avatars-identicon` |
| `@dicebear/avatars-initials-sprites`  | `@dicebear/avatars-initials`  |
| `@dicebear/avatars-jdenticon-sprites` | `@dicebear/avatars-jdenticon` |
| `@dicebear/avatars-male-sprites`      | `@dicebear/avatars-pixel-art` |

- The documentation was completely revised.

#### @dicebear/avatars

- Classes are rewritten as functions. This allows direct access to the `create` function without having to initialize an object first.

  Old API

  ```js
    import Avatars from `@dicebear/avatars`;
    import avatarStyle from `@dicebear/avatars-identicon-sprites`;

    let options = {};
    let seed = 'custom-seed';
    let avatars = new Avatars(avatarStyle, options);
    let svg = avatars.create(seed);
  ```

  New API

  ```js
    import * as avatars from `@dicebear/avatars`;
    import * as avatarStyle from `@dicebear/avatars-identicon`;

    let svg = avatars.create(avatarStyle, {
      seed: 'custom-seed',
      // ... and other options
    });
  ```

- If no `seed` is passed, a random one is defined.

- The following options have been renamed

  - `base64` => `dataUri`
  - `background` => `backgroundColor`

- The following colors have been renamed:
  - `blueGrey` => `blueGray`
  - `grey` => `gray`

#### @dicebear/avatars-avataaars

- The following options have been renamed
  - `topChance` => `topProbability`
  - `accessoriesChance` => `accessoriesProbability`
  - `facialHairChance` => `facialHairProbability`
  - `skin` => `skinColor`
  - `eyebrow` => `eyebrows`
  - `clothes` => `clothing` - To be closer to the names in the Sketch library.
  - `clothesColor` => `clothingColor` - To be closer to the names in the Sketch library.
- Renamed the following possible values of the `eyebrows` option:
  - `flat` => `flatNatural`
  - `unibrow` => `unibrowNatural`
- Renamed the following possible values of the `clothes` option:
  - `sweater` => `collarAndSweater`
- Renamed the following possible values of the `hairColor` option:
  - `pastel` => `pastelPink`
  - `gray` => `
- Renamed the following possible values of the `facialHairColor` option:
  - `pastel` => `pastelPink`
  - `gray` => `graySilver`

#### @dicebear/avatars-bottts

- The following options have been renamed
  - `mouthChance` => `mouthProbability`
  - `sidesChance` => `sidesProbability`
  - `textureChance` => `textureProbability`
  - `topChance` => `topProbability`

#### @dicebear/avatars-jdenticon

- Options are adapted to those of the 'jdenticon' library. This results in the following changes:
  - `colorLightness` => `lightnessColor`
  - `grayscaleLightness` => `lightnessGrayscale`
  - `colorSaturation` => `saturationColor`
  - `grayscaleSaturation` => `saturationGrayscale`

#### @dicebear/avatars-initials

- The following options have been renamed
  - `backgroundColors` => `backgroundColor`
  - `backgroundColorsLevel` => `backgroundColorVariation`

### Added

#### General

- New avatar styles!

  - `@dicebear/avatars-humaaans` [#52][1]
  - `@dicebear/avatars-open-peeps` [#51][2]
  - `@dicebear/avatars-personas` [#35][3]

- The following options are new:
  - `backgroundColorVariation`

#### @dicebear/avatars-avataaars

- New possible values for `eyebrows` option:
  - `frownNatural`
  - `angryNatural`
  - `defaultNatural`
  - `raisedExcited`
  - `raisedExcitedNatural`
  - `sadConcerned`
  - `sadConcernedNatural`
  - `upDown`
  - `upDownNatural`
  - `flatNatural`
- New possible values for `clothing` option:
  - `blazerAndShirt`
  - `blazerAndSweater`
  - `graphicShirt`
  - `shirtCrewNeck`
  - `shirtScoopNeck`
  - `shirtVNeck`
- New possible values for `clothingColor` option:
  - `blue01`
  - `blue02`
  - `blue03`
  - `gray01`
  - `gray02`
  - `pastelBlue`
  - `pastelGreen`
  - `pastelOrange`
  - `pastelRed`
  - `pastelYellow`
- New possible values for `hatColor` option:
  - `blue01`
  - `blue02`
  - `blue03`
  - `gray01`
  - `gray02`
  - `pastelBlue`
  - `pastelGreen`
  - `pastelOrange`
  - `pastelRed`
  - `pastelYellow`
- New possible values for `hairColor` option:
  - `blondeGolden`
  - `brownDark`
- New possible values for `facialHairColor` option:
  - `blondeGolden`
  - `brownDark`

#### @dicebear/avatars-pixel-art

- The following options are new:
  - `skinColor`
  - `accessories`
  - `clothing`
  - `eyebrows`
  - `eyes`
  - `eyesColor`
  - `glasses`
  - `glassesColor`
  - `hair`
  - `hairColor`
  - `hat`
  - `hatColor`
  - `mouth`
  - `mouthColor`
  - `mustache`

### Removed

#### @dicebear/avatars

- Color modifier classes (moved to `@dicebear/avatars-pixel-art`).
- Option `userAgent`.

#### @dicebear/avatars-avataaars

- The followig values of the `clothes` option are removed:
  - `blazer` - use `blazerAndShirt` and `blazerAndSweater` instead.
  - `shirt` - use `graphicShirt`, `shirtCrewNeck`, `shirtScoopNeck` and `shirtVNeck` instead.
- The followig values of the `eyebrows` option are removed:
  - `raised` - use `raisedExcited` and `raisedExcitedNatural` instead.
  - `sad` - use `sadConcerned` and `sadConcernedNatural` instead.
  - `up` - use `upDown` and `upDownNatural` instead.
- The followig values of the `clothingColor` option are removed:
  - `blue` - use `blue01`, `blue02` and `blue03` instead.
  - `gray` - use `gray01` and `gray02` instead.
  - `pastel` - use `pastelBlue`, `pastelGreen`, `pastelOrange`, `pastelRed` and `pastelYellow` instead.
- The followig values of the `hatColor` option are removed:
  - `blue` - use `blue01`, `blue02` and `blue03` instead.
  - `gray` - use `gray01` and `gray02` instead.
  - `pastel` - use `pastelBlue`, `pastelGreen`, `pastelOrange`, `pastelRed` and `pastelYellow` instead.

[1]: https://github.com/DiceBear/avatars/issues/52
[2]: https://github.com/DiceBear/avatars/issues/51
[3]: https://github.com/DiceBear/avatars/issues/35
