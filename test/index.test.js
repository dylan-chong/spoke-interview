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
    )('for a valid single tag %o', (tagName) => {
      expect(validateTags(`<${tagName}></${tagName}>`)).toEqual(VALID_RESULT);
    });

    test.each([
      ['before<A></A>'],
      ['<A></A>after'],
      ['before<A></A>after'],
      ['before<A>between</A>after'],
      ['before <A> between </A> after'],
      ['before and <A> between and </A> after and'],
    ])('for a single tag with content %o', (tagName) => {
      expect(validateTags(`<${tagName}></${tagName}>`)).toEqual(VALID_RESULT);
    });
  });

  describe('returns VALID_RESULT for ignored tags', () => {
    test.each(
      Array
        .from('abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*())-=_+')
        .map((tagName) => [tagName])
    )('for what appear to be tags but are actually ignored %o', (tagName) => {
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
    ])('for an incomplete tag of %o (they are ignored)', (tag) => {
      expect(validateTags(tag)).toEqual(VALID_RESULT);
    });
  });

  describe('matching tags with multiple tags', () => {
    test.each([
      // 1 level
      ['<A></A>'],
      ['<A></A><A></A>'],
      ['<A></A><B></B>'],
      // 2 levels
      ['<A> <B></B> <B></B> </A>'],
      ['<A> <B></B> <C></C> </A>'],
      ['<A><B></B></A>'],
      // 3 levels
      ['<A>  <B>  <C></C> <D></D>  </B> <E></E>  </A>'],
    ])('returns VALID_RESULT (for document with non matching tags %o)', (document) => {
      expect(validateTags(document)).toEqual(VALID_RESULT);
    });
  });

  describe('non-matching tags', () => {
    test.each([
      // 1 level
      ['<A>', 'Expected </A> found #'],
      ['<B>', 'Expected </B> found #'],
      ['<C>', 'Expected </C> found #'],
      ['</A>', 'Expected # found </A>'],
      ['<A></A><A>', 'Expected </A> found #'],
      ['<A></A></A>', 'Expected # found </A>'],
      ['<A><A><B></B></A>', 'Expected </A> found #'],
      // 2 levels
      ['<A><A>', 'Expected </A> found #'],
      ['<B><B>', 'Expected </B> found #'],
      ['<A><A></A>', 'Expected </A> found #'],
      ['<A></A> <B><C></C></D></B>', 'Expected </B> found </D>'],
    ])('returns invalid (for document %o)', (document, expectedMessage) => {
      expect(validateTags(document)).toEqual({ isValid: false, message: expectedMessage });
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

  describe('extra tests (tests from spec doc)', () => {
    test.each([
      [
        'The following text<C><B>is centred and in boldface</B></C>',
        VALID_RESULT
      ],
      [
        '<B>This <\\g>is <B>boldface</B> in <<*> a</B> <\\6> <<d>sentence',
        VALID_RESULT
      ],
      [
        '<B><C> This should be centred and in boldface, but the tags are wrongly nested </B></C>',
        {
          isValid: false,
          message: 'Expected </C> found </B>'
        }
      ],
      [
        '<B>This should be in boldface, but there is an extra closing tag</B></C>',
        {
          isValid: false,
          message: 'Expected # found </C>'
        }
      ],
      [
        '<B><C>This should be centred and in boldface, but there is a missing closing tag</C>',
        {
          isValid: false,
          message: 'Expected </B> found #'
        }
      ],
    ])('%o results in %o', (document, expectedResult) => {
      expect(validateTags(document)).toEqual(expectedResult);
    });
  });
});
