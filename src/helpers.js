const beforeTagAfterRegex = () => {
  /*
   * Explanation:
   * - Outer () for a capture group
   *   - Then any number of these (?:(?!<\/?[A-Z]>).), which is:
   *     - Non capturing: ?:
   *     - Make sure there's no open/close tag in front of us
   *       (negative lookahead): (?!<\/?[A-Z]>)
   *     - Match any character including new lines: [\s\S]
   */
  const before = '((?:(?!<\/?[A-Z]>)[\\s\\S])*)';
  const tag = '(<\/?[A-Z]>)'
  const after = '([\\s\\S]*)'
  return new RegExp('^' + before + tag + after + '$');
}

// const BEFORE_OPENING_TAG_AFTER_SEGMENT_REGEX = /^(.*)(<\/?[A-Z]>)(.*)$/;
// const BEFORE_AFTER_TAG_AFTER_SEGMENT_REGEX = /^(.*)(<\/?[A-Z]>)(.*)$/;
const NO_TAGS_FOUND = Symbol('NO_TAGS_FOUND');

/*
 * Splits the subDocument into before/tag/after segments or NO_TAGS_FOUND if no
 * tags are found. The value of `tag` is the first opening or closing tag in
 * the string.
 */
const findNextTag = (subDocument) => {
  const match = subDocument.match(beforeTagAfterRegex());

  if (match === null) return NO_TAGS_FOUND;

  return {
    before: match[1],
    tag: match[2],
    after: match[3]
  };
};

module.exports = {
  NO_TAGS_FOUND,
  findNextTag
};
