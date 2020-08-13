<br />
<br />

<h1 align="center"><img src="https://avatars.dicebear.com/api/male/10.svg" width="124" /> <br />@dicebear/avatars-pixel-art</h1>
<p align="center"><strong>Pixel art avatars for DiceBear Avatars</strong></p>

<p align="center">
    <a href="https://github.com/dicebear/avatars/blob/master/LICENSE" target="_blank">
        <img src="https://img.shields.io/github/license/dicebear/avatars.svg?style=flat-square" alt="License">
    </a>
    <a href="https://www.npmjs.com/package/@dicebear/avatars-pixel-art" target="_blank">
        <img src="https://img.shields.io/npm/v/@dicebear/avatars-pixel-art.svg?style=flat-square" alt="Latest Version">
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

    https://avatars.dicebear.com/api/pixel-art/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`options` can be used to pass [options](#options).

#### Examples

| preview                                                                                               | url                                                                          |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/api/pixel-art/example.svg" width="60" />                       | https://avatars.dicebear.com/api/pixel-art/example.svg                       |
| <img src="https://avatars.dicebear.com/api/pixel-art/example.svg?options[mood][]=happy" width="60" /> | https://avatars.dicebear.com/api/pixel-art/example.svg?options[mood][]=happy |
| <img src="https://avatars.dicebear.com/api/pixel-art/example.svg?options[mood][]=sad" width="60" />   | https://avatars.dicebear.com/api/pixel-art/example.svg?options[mood][]=sad   |

### NPM

Install the Avatars and this avatar style with the following command.

    npm install --save @dicebear/avatars @dicebear/avatars-pixel-art

Now you are ready to create your first Avatar.

```js
import * as avatars from '@dicebear/avatars';
import * as avatarSprites from '@dicebear/avatars-pixel-art';

let svg = avatars.create(avatarStyle, {
  seed: 'custom-seed',
  // ... and other options
});
```

## Options

| name                         | alias | type             | default                         | description                                                                                                                                       |
| ---------------------------- | ----- | ---------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| radius                       | r     | number           | `0`                             | Avatar border radius                                                                                                                              |
| base64                       |       | bool             | `false`                         | Return avatar as base64 data uri instead of XML <br> **Not supported by the HTTP API**                                                            |
| width                        | w     | number           | `null`                          | Fixed width                                                                                                                                       |
| height                       | h     | number           | `null`                          | Fixed height                                                                                                                                      |
| margin                       | m     | number           | `0`                             | Avatar margin in percent<br> **HTTP-API limitation** Max value `25`                                                                               |
| backgroundColor              | b     | string           | `null`                          | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| gender                       |       | string           | `nill`                          | Possible values: `male`, `female`                                                                                                                 |
| mood                         |       | array of strings | `['happy', 'sad', 'surprised']` | Possible values: `sad`, `happy`, `surprised`                                                                                                      |
| skinColor                    |       | array of numbers | `null`                          | Possible values: `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`                                                                    |
| maleMustacheProbability      |       | number           | `50`                            | Probability in percent                                                                                                                            |
| maleGlassesProbability       |       | number           | `25`                            | Probability in percent                                                                                                                            |
| maleHairProbability          |       | number           | `95`                            | Probability in percent                                                                                                                            |
| maleHatProbability           |       | number           | `5`                             | Probability in percent                                                                                                                            |
| femaleAccessoriesProbability |       | number           | `15`                            | Probability in percent                                                                                                                            |
| femaleGlassesProbability     |       | number           | `25`                            | Probability in percent                                                                                                                            |
| femaleHatProbability         |       | number           | `5`                             | Probability in percent                                                                                                                            |

## Further information

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)

---

_Inspired by [8biticon](https://github.com/matveyco/8biticon) (Copyright 2012 Plastic Jam - [MIT Licensed](https://github.com/matveyco/8biticon/blob/dfe624da950fb2f8c43e1151c380d333c2b12225/old_python/LICENSE))_
