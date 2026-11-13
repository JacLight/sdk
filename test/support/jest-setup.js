// The rule engine's tests (test-rules) are written for mocha + chai + sinon, as in json-rules-engine: they get mocha's
// hook names, chai's expect and the rule/condition factories. The SDK's own tests keep jest's expect.
const testPath = expect.getState().testPath || '';

if (/[\\/]test-rules[\\/]/.test(testPath)) {
  global.before = global.beforeAll;
  global.after = global.afterAll;
  global.context = global.describe;
  require('../../test-rules/support/bootstrap');
}
