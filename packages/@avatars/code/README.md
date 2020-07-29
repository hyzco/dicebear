<br />
<br />

<h1 align="center"><img src="https://avatars.dicebear.com/api/code/1.svg" width="124" /> <br />@avatars/code</h1>
<p align="center"><strong>Code style avatars for DiceBear Avatars</strong></p>

<p align="center">
    <a href="https://github.com/dicebear/avatars/blob/master/LICENSE" target="_blank">
        <img src="https://img.shields.io/github/license/dicebear/avatars.svg?style=flat-square" alt="License">
    </a>
    <a href="https://www.npmjs.com/package/@avatars/code" target="_blank">
        <img src="https://img.shields.io/npm/v/@avatars/code.svg?style=flat-square" alt="Latest Version">
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

    https://avatars.dicebear.com/api/code/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`options` can be used to pass [options](#options).

#### Examples

| preview                                                                                                                     | url                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| <img src="https://avatars.dicebear.com/api/code/example.svg" width="60" />                                                  | https://avatars.dicebear.com/api/code/example.svg                                                  |
| <img src="https://avatars.dicebear.com/api/code/example.svg?options[padding]=1&options[background]=%23f0f0f0" width="60" /> | https://avatars.dicebear.com/api/code/example.svg?options[padding]=1&options[background]=%23f0f0f0 |

### NPM

Install the Avatars and this avatar style with the following command.

    npm install --save @avatars/core @avatars/code

Now you are ready to create your first Avatar.

```js
import * as avatars from '@avatars/core';
import * as avatarSprites from '@avatars/code';

let svg = avatars.create(avatarStyle, {
  seed: 'custom-seed',
  // ... and other options
});
```

## Options

| name            | alias | type   | default | description                                                                                                                                       |
| --------------- | ----- | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| radius          | r     | number | `0`     | Avatar border radius                                                                                                                              |
| base64          |       | bool   | `false` | Return avatar as base64 data uri instead of XML <br> **Not supported by the HTTP API**                                                            |
| width           | w     | number | `null`  | Fixed width                                                                                                                                       |
| height          | h     | number | `null`  | Fixed height                                                                                                                                      |
| margin          | m     | number | `0`     | Avatar margin in percent<br> **HTTP-API limitation** Max value `25`                                                                               |
| background      | b     | string | `null`  | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| type            |       | string | `qr`    | Currently only "qr" is supported                                                                                                                  |
| color           |       | string | `null`  | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |
| correctionLevel |       | string | `M`     | Choose from `L`, `M`, `Q`, `H`                                                                                                                    |

## Further information

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)

"QR Code" is a registered trademark of DENSO WAVE INCORPORATED.
