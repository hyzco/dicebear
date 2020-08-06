# Installation

You can use avatars in several ways. It depends on your environment and project which method is right for you.

## HTTP-API <Badge text="recommended" type="tip" vertical="middle" />

The easiest way to use avatars is through our free HTTP API. The API is free of charge, can be used without registration and, thanks to our CDN, is accessible worldwide with low latency.

The structure of the URL looks like this:

```
https://avatars.dicebear.com/api/:style/custom-seed.svg
```

You have to replace `:style` with your favorite avatar style - for example `pixel-art`. `custom-seed` can be replaced by any string. If you want to specify options to control the look of the avatars, see the [Options](/guide/options) section.

For example, you can put the resulting URL directly into the `src` attribute of an `img` tag on your website.

```html
<img src="https://avatars.dicebear.com/api/pixel-art/custom-seed.svg" alt="DiceBear Avatars is awesome!" />
```

::: warning Don't use sensitive or personal data as seed!
The generated avatars can indicate the used seed. Also, when using the HTTP API, the seed is transferred to our servers and we are not interested in your personal data. Instead, use a general value that cannot be assigned to a person.
:::

## NPM

Avatars can be used on the client and server side. You need the core package and an avatar style. If you want to create pixel art avatars, you need to install the package `@avatars/core` and the package `@avatars/pixel-art`.

```bash
# With npm
npm install @avatars/core @avatars/pixel-art
```

```bash
# With yarn
yarn add @avaatars/core @avatars/pixel-art
```

Now you can create your first avatar.

```js
import * as avatars from '@avatars/core';
import * as avatarStyle from '@avatars/pixel-art';

let svg = avatars.create(avatarStyle, {
  seed: 'custom-seed',
  // ... and other options
});
```

You can get an overview of all available avatar styles under [Styles => Overview](/guide/styles). There you can also find out which packages you have to install exactly for your preferred avatar style and how to use them. There you will also find out which [options](/guide/options) are available to you.

::: tip Typescript user?
Then you will be happy to know that each of our packages already has a declaration file. You can start immediately. Happy typing!
:::

## CDN

Another easy way is our CDN, which allows you to embed our library directly on your site. You don't need a module bundler like _webpack_ or _rollup_.

Just include the core library and the desired avatar style as follows. In our example we use `pixel-art` again.

```html
<script src="https://avatars.dicebear.com/cdn/latest/@avatars/core.min.js"></script>
<script src="https://avatars.dicebear.com/cdn/latest/@avatars/pixel-art.min.js"></script>
```

Now you can create avatars as follows:

```js
let svg = Avatars.create(Avatars.PixelArt, {
  seed: 'custom-seed',
  // ... and other options
});
```

If you are interested in other avatar styles, see [Styles => Overview](/guide/styles). There you can find more examples and available [options](/guide/options).
