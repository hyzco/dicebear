const plugin = require('tailwindcss/plugin');
const fs = require('fs');
const path = require('path');

let transparent = fs.readFileSync(path.join(__dirname, 'src/transparent.svg'), {
  encoding: 'utf-8',
});

module.exports = {
  purge: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    defaultLineHeights: true,
    standardFontWeights: true,
  },
  theme: {
    extend: {
      gridTemplateColumns: {
        cards: 'repeat(auto-fill, minmax(240px, 1fr))',
        parts: 'repeat(auto-fill, minmax(120px, 1fr))',
        colors: 'repeat(auto-fill, minmax(22px, 1fr))',
      },
      spacing: {
        full: '100%',
      },
    },
  },
  variants: {},
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.bg-transparent-shape': {
          'background-image': `url(data:image/svg+xml;utf8,${encodeURIComponent(transparent)})`,
        },
      });
    }),
  ],
};
