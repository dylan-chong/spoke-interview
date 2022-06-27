const validateTags = require('../src');

describe('validateTags', () => {
  describe('returns true (very simple cases)', () => {
    test('for an empty document', () => {
      expect(validateTags('')).toEqual(true);
    });

    test('for a document with no tags', () => {
      expect(validateTags('hello This is (A) test [B] with no [T]ags')).toEqual(true);
    });
  });

  describe('returns true (single tags)', () => {
    test.each(
      Array
        .from('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
        .map((tagName) => [tagName])
    )('for a valid single tag (%s)', (tagName) => {
      expect(validateTags(`<${tagName}></${tagName}>`)).toEqual(true);
    });
  });

  describe('ignored tags', () => {
    test.each(
      Array
        .from('abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*())-=_+')
        .map((tagName) => [tagName])
    )('for what appear to be tags but are actually ignored (%s)', (tagName) => {
      expect(validateTags(`<${tagName}></${tagName}>`)).toEqual(true);
    });

    test.each([
      ['<A'],
      ['<A >'],
      ['A>'],
      ['< A>'],
      ['before< A>'],
      ['< A>after'],
      ['before < A>'],
      ['< A> after'],
      ['before < A> after'],
    ])('for an incomplete tag of `%s` (they are ignored)', (tag) => {
      expect(validateTags(tag)).toEqual(true);
    })
  });

  describe('returns false (for invalid tags)', () => {
    // TODO
  });

  test.each([
    [null],
    [undefined],
    [NaN],
    [1],
    [false],
    [true],
  ])('raise error for an non-string document `%p`', (badValue) => {
    expect(() => validateTags(badValue)).toThrow(/Invalid document\. Expected a string/)
  });
});
