const {
  NO_TAGS_FOUND,
  findNextTag
} = require('../src/helpers');

describe('findNextTag', () => {
  test.each([
    ['<A'],
    ['<A >'],
    ['</A >'],
    ['A>'],
    ['< A>'],
    ['before< A>'],
    ['< A>after'],
    ['before < A>'],
    ['< A> after'],
    ['before < A> after'],
    ['before </ A> after'],
  ])('it returns NO_TAGS_FOUND when no tags are found', (subDocument) => {
    expect(findNextTag(subDocument)).toEqual(NO_TAGS_FOUND);
  })

  test.each([
    ['<A>', {before: '', tag: '<A>', after: ''}],
    ['before<A>after', {before: 'before', tag: '<A>', after: 'after'}],
    ['before<A></A>', {before: 'before', tag: '<A>', after: '</A>'}],
    ['before</A><A>', {before: 'before', tag: '</A>', after: '<A>'}],
    ['before <A> between </A> after', {before: 'before ', tag: '<A>', after: ' between </A> after'}],
    ['before </A> and <A> after', {before: 'before ', tag: '</A>', after: ' and <A> after'}],
    ['before\n</A>\nand\n<A>\nafter', {before: 'before\n', tag: '</A>', after: '\nand\n<A>\nafter'}],
    ['before\t</A>\tand\t<A>\tafter', {before: 'before\t', tag: '</A>', after: '\tand\t<A>\tafter'}],
  ])('when given a tag in %o it returns %o', (subDocument, expectedResult) => {
    expect(findNextTag(subDocument)).toEqual(expectedResult);
  });
});
