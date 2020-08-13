# How to use

You can use Avatars in several ways. It depends on your environment and project which method is right for you.

::: tip
Are you looking for a user interface for user-generated avatars? Or are you looking for wrappers for your frontend framework? Then have a look at [Extensions](/guide/extensions).
:::

## NPM <Badge text="recommended" type="tip" vertical="middle" />

Avatars can be used on the client and server side. You need the core package and an avatar style. If you want to create pixel art avatars, you need to install the package `@dicebear/avatars` and the package `@dicebear/avatars-pixel-art`.

```bash
# With npm
npm install @dicebear/avatars @dicebear/avatars-pixel-art
```

```bash
# With yarn
yarn add @avaatars/core @dicebear/avatars-pixel-art
```

Now you can create your first avatar.

```js
import * as avatars from '@dicebear/avatars';
import * as avatarStyle from '@dicebear/avatars-pixel-art';

let svg = avatars.create(avatarStyle, {
  seed: 'custom-seed',
  // ... and other options
});
```

You can get an overview of all available avatar styles under [Styles => Overview](/guide/styles). There you can also find out which packages you have to install exactly for your preferred avatar style and how to use them. There you will also find out which [options](/guide/options) are available to you.

::: tip Typescript user?
Then you will be happy to know that each of our packages already has a declaration file. You can start immediately. Happy typing!
:::

::: warning Don't use sensitive or personal data as seed!
The generated avatars can indicate the used seed. Instead, use a general value that cannot be assigned to a person.
:::

## HTTP-API

The easiest way to use Avatars is through our free HTTP API. The API is free of charge, can be used without registration and, thanks to our CDN, is accessible worldwide with low latency.

The structure of the URL looks like this:

```
https://avatars.dicebear.com/api/:style/custom-seed.svg
```

You have to replace `:style` with your favorite [avatar style](/guide/styles) - for example `pixel-art`. `custom-seed` can be replaced by any string.

For example, you can put the resulting URL directly into the `src` attribute of an `img` tag on your website.

```html
<img src="https://avatars.dicebear.com/api/pixel-art/custom-seed.svg" alt="DiceBear Avatars is awesome!" />
```

### Options

You want to define some options? No problem! Just append the options you want as query parameters to the URL. For example, if you want to limit the avatars to a size of 1024x1024 pixels, you can use the following URL:

```
https://avatars.dicebear.com/api/pixel-art/custom-seed.svg?width=1024&height=1024
```

You like short URLs? We like them too! That's why you have a number of aliases available. For example `w` for `width` or `h` for `height`. So your URL can also look like this:

```
https://avatars.dicebear.com/api/pixel-art/custom-seed.svg?w=1024&h=1024
```

If you want to know which [options](/guide/options) are available to you, select your avatar style under [Styles => Overview](/guide/styles).

::: warning Small restriction
Due to the design of the API, `seed` is not an optional value here. If no seed is specified (in other words, no filename), it is equivalent to an empty seed, but not an undefined one.
:::

::: warning Again: Don't use sensitive or personal data as seed!
The generated avatars can indicate the used seed. Also, when using the HTTP API, the seed is transferred to our servers and we are not interested in your personal data.
:::

## CDN

You're a friend of the '90s? :vhs: :cd: Then you'll be happy to know that you can also embed Avatars into your website via a simple script tag. With our CDN you do not need a module bundler like _webpack_ or _rollup_.

Just load the core library and an additional avatar style and you are ready to go. For example, add these two lines to your `<head>` section. In our example we use `pixel-art` again.

```html
<script src="https://avatars.dicebear.com/cdn/latest/@dicebear/avatars.min.js"></script>
<script src="https://avatars.dicebear.com/cdn/latest/@dicebear/avatars-pixel-art.min.js"></script>
```

Now you can create avatars as follows:

```html
<script>
  let svg = Avatars.create(Avatars.PixelArt, {
    seed: 'custom-seed',
    // ... and other options
  });
</script>
```

If you are interested in other avatar styles, see [Styles => Overview](/guide/styles). There you can find more examples and available [options](/guide/options).
