module.exports = function (api) {
  api.cache(true);

  return {
    plugins: [
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
