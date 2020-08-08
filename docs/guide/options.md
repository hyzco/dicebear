# Options

These options are always available. For more options, see the documentation for your [avatar style](/guide/styles).

## seed <Badge text="alias: s" type="tip" vertical="middle" />

**type:** `string`  
**default:** `Math.random().toString()`

If you specify a seed, the generated avatar is calculated based on this seed. It is a [deterministic system](https://en.wikipedia.org/wiki/Deterministic_system). So the same seed generates the same avatar over and over again. If you don't specify a seed, the avatar will always be a completely random avatar unless you define other options that narrow down the randomness.

## radius <Badge text="alias: r" type="tip" vertical="middle" />

**type:** `number`  
**default:** `0`

This option works like the CSS property [border-radius](https://developer.mozilla.org/de/docs/Web/CSS/border-radius) with percentage values. You can use it to round the corners of the avatars. For example, you can get completely round avatars with a value of `50`, and a value of `0` means no border radius.

## dataUri

**type:** `boolean`  
**default:** `false`

Sometimes it can be useful to have a [data uri](https://en.wikipedia.org/wiki/Data_URI_scheme) instead of [XML](https://en.wikipedia.org/wiki/XML) returned. In this case, specify this option with the value `true`.

::: warning HTTP-API Limitations
The HTTP API does not support this option, as the API is mainly intended to be used directly as an image source.
:::

## width <Badge text="alias: w" type="tip" vertical="middle" />

**type:** `number`  
**default:** `undefined`

The avatars are responsive by default. They always take up the space that is made available to them. If this behavior is not desired, there are several ways to limit the width, depending on the application. One of them is this option. The values are interpreted as pixels.

## height <Badge text="alias: h" type="tip" vertical="middle" />

**type:** `number`  
**default:** `undefined`

The avatars are responsive by default. They always take up the space that is made available to them. If this behavior is not desired, there are several ways to limit the height, depending on the application. One of them is this option. The values are interpreted as pixels.

## margin <Badge text="alias: m" type="tip" vertical="middle" />

**type:** `number`  
**default:** `0`

This option can be used to create a padding within the avatar. The specifications are interpreted as a percentage. This means: At a value of `50` there is no picture to be seen anymore, because left and right as well as top and bottom 50% together make 100% and no space is left for the actual avatar. We recommend a maximum value of `25`.

::: warning HTTP-API Limitations
Only values between `0` and `25` are allowed.
:::

## background <Badge text="alias: b" type="tip" vertical="middle" />

**type:** `string`  
**default:** `undefined`

Allows you to color the background of the avatar. Apart from possible restrictions of the application environment, all color spaces are possible here. We recommend specifying [hex colors](https://en.wikipedia.org/wiki/Web_colors) for maximum compatibility across applications.

::: warning HTTP-API Limitations
Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`. For example, `#ff0000` becomes `%23ff0000`.
:::
