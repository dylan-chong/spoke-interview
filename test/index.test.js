const validateTags = require('../src');

const VALID_RESULT = { isValid: true, message: 'Correctly tagged paragraph' };

describe('validateTags', () => {
  describe('returns VALID_RESULT (very simple cases)', () => {
    test('for an empty document', () => {
      expect(validateTags('')).toEqual(VALID_RESULT);
    });

    test('for a document with no tags', () => {
      expect(validateTags('hello This is (A) test [B] with no [T]ags')).toEqual(VALID_RESULT);
    });
  });

  describe('returns VALID_RESULT (single tags)', () => {
    test.each(
      Array
        .from('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
        .map((tagName) => [tagName])
    )('for a valid single tag (%s)', (tagName) => {
      expect(validateTags(`<${tagName}></${tagName}>`)).toEqual(VALID_RESULT);
    });

    test.each([
      ['before<A></A>'],
      ['<A></A>after'],
      ['before<A></A>after'],
      ['before<A>between</A>after'],
      ['before <A> between </A> after'],
      ['before and <A> between and </A> after and'],
    ])('for a single tag with content (%s)', (tagName) => {
      expect(validateTags(`<${tagName}></${tagName}>`)).toEqual(VALID_RESULT);
    });
  });

  describe('returns VALID_RESULT (2 tags)', () => {
    test.each([
      ['<A></A>']
    ])('for a valid single tag (%s)', (tagName) => {
      expect(validateTags(`<${tagName}></${tagName}>`)).toEqual(VALID_RESULT);
    });
  });

  describe('ignored tags', () => {
    test.each(
      Array
        .from('abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*())-=_+')
        .map((tagName) => [tagName])
    )('for what appear to be tags but are actually ignored (%s)', (tagName) => {
      expect(validateTags(`<${tagName}></${tagName}>`)).toEqual(VALID_RESULT);
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
      expect(validateTags(tag)).toEqual(VALID_RESULT);
    });
  });

  describe('non-matching tags', () => {
    test.each([
      ['<A>'],
      ['<B>'],
      ['<C>'],
      ['<A><A>'],
      ['<B><B>'],
      ['<A></A><A>'],
      ['<A><A></A>'],
    ])('returns false (for document with non matching tags `%s`)', (document) => {
      expect(validateTags(document)).toEqual(false);
    });
  });

  test.each([
    [null],
    [undefined],
    [NaN],
    [1],
    [false],
    [VALID_RESULT],
  ])('raise error for an non-string document `%p`', (badValue) => {
    expect(() => validateTags(badValue)).toThrow(/Invalid document\. Expected a string/)
  });
});
