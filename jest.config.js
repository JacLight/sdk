// Merged by `tsdx test` over its own jest config.
const path = require('path');

// ts-jest comes with tsdx; the rule engine (src/rules) and its tests are plain ES-module JavaScript, compiled by babel.
const tsJest = require.resolve('ts-jest/dist', { paths: [path.dirname(require.resolve('tsdx/package.json'))] });

module.exports = {
  transform: { '.(ts|tsx)$': tsJest, '.(js|jsx)$': '<rootDir>/test/support/babel-transform.js' },
  testMatch: ['<rootDir>/test/**/*.(spec|test).{ts,tsx}', '<rootDir>/src/**/*.(spec|test).{ts,tsx}', '<rootDir>/test-rules/**/*.js'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/dist/', '<rootDir>/test-rules/support/'],
  setupFilesAfterEnv: ['<rootDir>/test/support/jest-setup.js'],
};
