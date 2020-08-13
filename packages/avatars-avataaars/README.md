<br />
<br />

<h1 align="center"><img src="https://avatars.dicebear.com/api/avataaars/1.svg" width="124" /> <br />@dicebear/avatars-avataaars</h1>
<p align="center"><strong>Avataaars by <a href="https://twitter.com/pablostanley" target="_blank">Pablo Stanley</a> for DiceBear Avatars</strong></p>

<p align="center">
    <a href="https://github.com/dicebear/avatars/blob/master/LICENSE" target="_blank">
        <img src="https://img.shields.io/github/license/dicebear/avatars.svg?style=flat-square" alt="License">
    </a>
    <a href="https://www.npmjs.com/package/@dicebear/avatars-avataaars" target="_blank">
        <img src="https://img.shields.io/npm/v/@dicebear/avatars-avataaars.svg?style=flat-square" alt="Latest Version">
    </a>
    <a href="https://github.com/dicebear/avatars/stargazers" target="_blank">
        <img src="https://img.shields.io/github/stars/dicebear/avatars?style=flat-square" alt="Stargazers">
    </a>
</p>
<br />
<br />

## Usage

### HTTP-API (recommended)

Our free HTTP-API is the easiest way to use this avatar style. Just use the following URL as image source.

    https://avatars.dicebear.com/api/avataaars/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`options` can be used to pass [options](#options).

#### Examples

| preview                                                                                                                                     | url                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| <img src="https://avatars.dicebear.com/api/avataaars/example.svg" width="60" />                                                             | https://avatars.dicebear.com/api/avataaars/example.svg                                                             |
| <img src="https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair" width="60" />                                    | https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair                                    |
| <img src="https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesProbability]=93" width="60" /> | https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesProbability]=93 |

### NPM

Install the Avatars and this avatar style with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-avataaars

Now you are ready to create your first Avatar.

```js
import * as avatars from '@dicebear/avatars';
import * as avatarSprites from '@dicebear/avatars-avataaars';

let svg = avatars.create(avatarStyle, {
  seed: 'custom-seed',
  // ... and other options
});
```

## Options

| name                   | alias | type             | default       | description                                                                                                                                                                                                                       |
| ---------------------- | ----- | ---------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| radius                 | r     | number           | `0`           | Avatar border radius                                                                                                                                                                                                              |
| base64                 |       | bool             | `false`       | Return avatar as base64 data uri instead of XML <br> **Not supported by the HTTP API**                                                                                                                                            |
| width                  | w     | number           | `null`        | Fixed width                                                                                                                                                                                                                       |
| height                 | h     | number           | `null`        | Fixed height                                                                                                                                                                                                                      |
| margin                 | m     | number           | `0`           | Avatar margin in percent<br> **HTTP-API limitation** Max value `25`                                                                                                                                                               |
| backgroundColor        | b     | string           | `null`        | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`.                                                                                 |
| style                  |       | string           | `transparent` | One of: `transparent`, `circle`                                                                                                                                                                                                   |
| mode                   |       | string           | `include`     | `include` or `exclude` passed options.                                                                                                                                                                                            |
| top                    |       | array of strings | `null`        | Possible values: `longHair`, `shortHair`, `eyepatch`, `hat`, `hijab`, `turban`                                                                                                                                                    |
| topProbability         |       | number           | `100`         | Probability in percent                                                                                                                                                                                                            |
| hatColor               |       | array of strings | `null`        | Possible values: `black`, `blue`, `gray`, `heather`, `pastel`, `pink`, `red`, `white`                                                                                                                                             |
| hairColor              |       | array of strings | `null`        | Possible values: `auburn`, `black`, `blonde`, `brown`, `pastel`, `platinum`, `red`, `gray`                                                                                                                                        |
| accessories            |       | array of strings | `null`        | Possible values: `kurt`, `prescription01`, `prescription02`, `round`, `sunglasses`, `wayfarers`                                                                                                                                   |
| accessoriesProbability |       | number           | `10`          | Probability in percent                                                                                                                                                                                                            |
| facialHair             |       | array of strings | `null`        | Possible values: `medium`, `light`, `majestic`, `fancy`, `magnum`                                                                                                                                                                 |
| facialHairProbability  |       | number           | `10`          | Probability in percent                                                                                                                                                                                                            |
| facialHairColor        |       | array of strings | `null`        | Possible values: `auburn`, `black`, `blonde`, `brown`, `platinum`, `red`                                                                                                                                                          |
| clothing               |       | array of strings | `null`        | Possible values: `blazerAndShirt`, `blazerAndSweater`, `collarAndSweater`, `graphicShirt`, `shirtCrewNeck`, `shirtScoopNeck`, `shirtVNeck`, `hoodie`, `overall`                                                                   |
| clothingColor          |       | array of strings | `null`        | Possible values: `black`, `blue`, `gray`, `heather`, `pastel`, `pink`, `red`, `white`                                                                                                                                             |
| eyes                   |       | array of strings | `null`        | Possible values: `close`, `cry`, `default`, `dizzy`, `roll`, `happy`, `hearts`, `side`, `squint`, `surprised`, `wink`, `winkWacky`                                                                                                |
| eyebrows               |       | array of strings | `null`        | Possible values: `angry`, `angryNatural`, `default`, `defaultNatural`, `flatNatural`, `raisedExcited`, `raisedExcitedNatural`, `sadConcerned`, `sadConcernedNatural`, `upDown`, `upDownNatural`, `frownNatural`, `unibrowNatural` |
| mouth                  |       | array of strings | `null`        | Possible values: `concerned`, `default`, `disbelief`, `eating`, `grimace`, `sad`, `scream`, `serious`, `smile`, `tongue`, `twinkle`, `vomit`                                                                                      |
| skin                   |       | array of strings | `null`        | Possible values: `tanned`, `yellow`, `pale`, `light`, `brown`, `darkBrown`, `black`                                                                                                                                               |

## Further information

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)
