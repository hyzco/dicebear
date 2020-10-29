module.exports = function (api) {
  api.cache(true);

  return {
    presets: [['@babel/env', { modules: false }], '@babel/typescript'],
    plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread'],
  };
};
