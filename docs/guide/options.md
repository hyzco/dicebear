# Options

You have several options to control the look of the generated avatars. You define them as follows:

```js
let svg = avatars.create(avatarStyle, {
  seed: 'custom-seed',
  width: 1024,
  height: 1024,
  // ... and other options
});
```

If you use the HTTP API, you can append the options (except for the seed) to the URL as query parameters like this:

```
https://avatars.dicebear.com/api/pixel-art/custom-seed.svg?width=1024&height=1024
```

## Default options

These options are always available. For more options, see the documentation for your [avatar style](/guide/styles).

### seed <Badge text="alias: s" type="tip" vertical="middle" />

**type:** `string`  
**default:** `Math.random().toString()`

Avatar seed

### radius <Badge text="alias: r" type="tip" vertical="middle" />

**type:** `number`  
**default:** `0`

Avatar border

### dataUri

**type:** `boolean`  
**default:** `false`

Return avatar as data uri instead of XML.

::: details HTTP-API Limitations
Not supported by the HTTP API
:::

### width <Badge text="alias: w" type="tip" vertical="middle" />

**type:** `number`  
**default:** `undefined`

Fixed width

### height <Badge text="alias: h" type="tip" vertical="middle" />

**type:** `number`  
**default:** `undefined`

Fixed height

### margin <Badge text="alias: m" type="tip" vertical="middle" />

**type:** `number`  
**default:** `0`

Avatar margin in percent

::: details HTTP-API Limitations
Max value `25`
:::

### background <Badge text="alias: b" type="tip" vertical="middle" />

**type:** `string`  
**default:** `undefined`

Any valid color identifier

::: details HTTP-API Limitations
Only hex _(3-digit, 6-digit and 8-digit)_ values are allowed. Use url encoded hash: `%23`.
:::
