<br />
<br />

<h1 align="center"><img src="https://avatars.dicebear.com/api/male/1.svg" width="124" /> <br />DiceBear Avatars</h1>
<p align="center"><strong>Avatars is an avatar placeholder library for designers and developers.</strong></p>

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

Our free HTTP-API is the easiest way to use Avatars. Just use the following URL as image source.

    https://avatars.dicebear.com/api/:sprites/:seed.svg

Replace `:sprites` with `pixel-art`, `identicon`, `initials`, `bottts`, `avataaars`, `jdenticon`, `gridy` or `code`. The value of `:seed` can be anything you
like - but **don't** use any sensitive or personal data here!

The used avatar style may offer additional options, which can be set using the GET parameter named `options`.
For example, to create a happy _male_ avatar with the seed `john`, the following URL can be used:

    https://avatars.dicebear.com/api/male/john.svg?options[mood]=happy

### NPM

Choose NPM if you want to use a spriteCollection that is not available via the HTTP-API.

Install the Avatars package with the following command.

    npm install --save @avatars/core

You also need to add a avatar style. In our example, we will use the male avatar style.

    npm install --save @avatars/male

Now you are ready to create your first Avatar.

```js
import * as avatars from '@avatars/core';
import * as avatarSprites from '@avatars/male';

let svg = avatars.create(avatarStyle, {
  seed: 'custom-seed',
  // ... and other options
});
```

### Available options

The following options are available for each avatar style.

| name            | alias | type   | default | description                                                                                                                                       |
| --------------- | ----- | ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| radius          | r     | number | `0`     | Avatar border radius                                                                                                                              |
| base64          |       | bool   | `false` | Return avatar as base64 data uri instead of XML <br> **Not supported by the HTTP API**                                                            |
| width           | w     | number | `null`  | Fixed width                                                                                                                                       |
| height          | h     | number | `null`  | Fixed height                                                                                                                                      |
| margin          | m     | number | `0`     | Avatar margin in percent<br> **HTTP-API limitation** Max value `25`                                                                               |
| backgroundColor | b     | string | `null`  | Any valid color identifier<br> **HTTP-API limitation** Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. |

More available options can be found in the README.md of each avatar style.

## Further information

You can find the complete documentation at [avatars.dicebear.com](https://avatars.dicebear.com)
