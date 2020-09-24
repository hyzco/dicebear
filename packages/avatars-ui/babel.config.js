module.exports = function (api) {
  api.cache(true);

  return {
    presets: [['@babel/env', { modules: false }], '@babel/typescript'],
    plugins: [
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread',
      [
        'babel-plugin-remove-template-literals-whitespace',
        {
          fn: (string = '') => {
            return string
              .toString()
              .replace(/^\s+/gm, '')
              .replace(/[\r\n]/g, '')
              .replace(/\s+/g, ' ');
          },
        },
      ],
    ],
  };
};
