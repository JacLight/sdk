// The rule engine (src/rules) and its tests are plain ES-module JavaScript; jest compiles them for the Node it runs on.
module.exports = require('babel-jest').createTransformer({
  babelrc: false,
  configFile: false,
  presets: [[require.resolve('@babel/preset-env'), { targets: { node: 'current' } }]],
});
