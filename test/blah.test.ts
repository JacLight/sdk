import { isEmpty } from '../src';

describe('isEmpty', () => {
  it('works', () => {
    expect(isEmpty({})).toBe(true);
  });
});
