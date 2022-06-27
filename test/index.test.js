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
        .map((tagInner) => [tagInner])
    )('for a valid single tag (%s)', (tagInner) => {
      expect(validateTags(`<${tagInner}></${tagInner}>`)).toEqual(true);
    });

    test.each(
      Array
        .from('abcdefghijklmnopqrstuvwxyz!@#$%^&*())-=_+')
        .map((tagInner) => [tagInner])
    )('for what appear to be tags but are actually ignored (%s)', (tagInner) => {
      expect(validateTags(`<${tagInner}></${tagInner}>`)).toEqual(true);
    });
  });

  describe('returns false (for invalid tags)', () => {
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
