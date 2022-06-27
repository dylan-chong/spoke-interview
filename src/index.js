/**
 * Returns true iff the given XML-like document has matching tags.
 *
 * Notes:
 * - Tags are enclosed by angle brackets, and have a single uppercase letter
 * - You can have freeform text between or outside tags
 * - `\\` characters don't do anything
 */
const validateTags = (document) => {
  if (typeof document !== 'string')
    throw new Error('Invalid document. Expected a string');

  const tags = document.match(/<\/?[A-Z]>/g) || [];
  const { isValid, message } = validateTagsWithStack(tags);

  if (isValid) {
    return { isValid: true, message: 'Correctly tagged paragraph' };
  } else {
    return { isValid: false, message };
  }
  // TODO prints output
};

const isClosingTag = (tag) => tag.indexOf('/') !== -1;

const closingToOpeningTag = (openingTag) => openingTag.replace('</', '<');

const openingToClosingTag = (openingTag) => openingTag.replace('<', '</');

const last = (array) => array[array.length - 1];

const validateTagsWithStack = (tags) => {
  // Contains opening tags
  const tagStack = [];

  for (const nextTag of tags) {
    if (!isClosingTag(nextTag)) {
      tagStack.push(nextTag);
      continue;
    }

    // Is closing tag
    if (last(tagStack) === closingToOpeningTag(nextTag)) {
      tagStack.pop();
      continue;
    }

    // Closing tag is not what we expected, so is a stray one
    if (tagStack.length === 0) {
      return { isValid: false, message: `Expected # found ${nextTag}` };
    } else {
      return {
        isValid: false,
        message: `Expected ${openingToClosingTag(last(tagStack))} found ${nextTag}`
      };
    }
  }

  if (tagStack.length === 0) {
    return { isValid: true, message: 'Correctly tagged paragraph', remainingTags: [] };
  } else {
    return {
      isValid: false,
      message: `Expected ${openingToClosingTag(last(tagStack))} found #`
    };
  }
};

module.exports = validateTags;

// TODO README
// TODO github repo
// TODO tests from doc
