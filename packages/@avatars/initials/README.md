<br />
<br />

<h1 align="center"><img src="https://avatars.dicebear.com/api/initials/John%20Die.svg" width="124" /> <br />@avatars/initials</h1>
<p align="center"><strong>Initial avatars for DiceBear Avatars</strong></p>

<p align="center">
    <a href="https://github.com/dicebear/avatars/blob/master/LICENSE" target="_blank">
        <img src="https://img.shields.io/github/license/dicebear/avatars.svg?style=flat-square" alt="License">
    </a>
    <a href="https://www.npmjs.com/package/@avatars/initials" target="_blank">
        <img src="https://img.shields.io/npm/v/@avatars/initials.svg?style=flat-square" alt="Latest Version">
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

    https://avatars.dicebear.com/api/initials/:seed.svg

The value of `:seed` can be anything you like - but **don't** use any sensitive or personal data here! The GET parameter
`options` can be used to pass [options](#options).

#### Examples

| preview                                                                                                             | url                                                                                        |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| <img src="https://avatars.dicebear.com/api/initials/John%20Doe.svg" width="60" />                                   | https://avatars.dicebear.com/api/initials/John%20Doe.svg                                   |
| <img src="https://avatars.dicebear.com/api/initials/John%20Doe.svg?options[fontSize]=80" width="60" />              | https://avatars.dicebear.com/api/initials/John%20Doe.svg?options[fontSize]=80              |
| <img src="https://avatars.dicebear.com/api/initials/John%20Doe.svg?options[backgroundColorLevel]=900" width="60" /> | https://avatars.dicebear.com/api/initials/John%20Doe.svg?options[backgroundColorLevel]=900 |

### NPM

Install the Avatars and this avatar style with the following command.

    npm install --save @avatars/core @avatars/initials

Now you are ready to create your first Avatar.

```js
import * as avatars from '@avatars/core';
import * as avatarSprites from '@avatars/initials';

let svg = avatars.create(avatarStyle, {
  seed: 'custom-seed',
  // ... and other options
});
```

## Options

| name                 | alias | type             | default | description                                                                                                                                                                                                  |
| -------------------- | ----- | ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| radius               | r     | number           | `0`     | Avatar border radius                                                                                                                                                                                         |
| base64               |       | bool             | `false` | Return avatar as base64 data uri instead of XML <br> **Not supported by the HTTP API**                                                                                                                       |
| width                | w     | number           | `null`  | Fixed width                                                                                                                                                                                                  |
| height               | h     | number           | `null`  | Fixed height                                                                                                                                                                                                 |
| margin               | m     | number           | `0`     | Avatar margin in percent<br> **HTTP-API limitation** Max value `25`                                                                                                                                          |
| background           | b     | string           | `null`  | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`.                                                            |
| backgroundColors     |       | array of strings | `null`  | Possible values: `amber`, `blue`, `blueGrey`, `brown`, `cyan`, `deepOrange`, `deepPurple`, `green`, `grey`, `indigo`, `lightBlue`, `lightGreen`, `lime`, `orange`, `pink`, `purple`, `red`, `teal`, `yellow` |
| backgroundColorLevel |       | number           | `600`   | Possible values: `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`                                                                                                                         |
| fontSize             |       | number           | `50`    | Number between 1 and 100                                                                                                                                                                                     |
| chars                |       | number           | `2`     | Number between 0 and 2                                                                                                                                                                                       |
| bold                 |       | bool             | `false` |                                                                                                                                                                                                              |

## Further information

You can find the DiceBear Avatars documentation at [avatars.dicebear.com](https://avatars.dicebear.com)
