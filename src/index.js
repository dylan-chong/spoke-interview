const {
  NO_TAGS_FOUND,
  findNextTag
} = require('./helpers');

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

  const match = findNextTag(document);
  if (match === NO_TAGS_FOUND) return { isValid: true };

  const { isValid, errorMessage } = validateTagsRecursive(match.tag, match.after);

  if (isValid) {
    return { isValid: true, message: 'Correctly tagged paragraph' };
  } else {
    return { isValid: false, message: errorMessage };
  }
  // TODO prints output
};

const validateTagsRecursive = (currentOpeningTag, subDocAfterOpening) => {
  const expectedClosingTag = currentOpeningTag.replace('<', '</');

  const matchAfterOpening = findNextTag(subDocAfterOpening);
  if (matchAfterOpening === NO_TAGS_FOUND) {
    return { isValid: false, errorMessage: `Expected ${expectedClosingTag} but found #` };
  }

  const { tag: nextTag, after: subDocAfterTag } = matchAfterOpening;

  // if (isClosingTag(nextTag)) {
    // TODO tests for this

  if (nextTag === expectedClosingTag) {
    return { isValid: true, remainingSubDoc: subDocAfterTag };
  }

  // Recursing to match nested tags

  const nestedOpeningTag = nextTag;
  const { isValid, errorMessage, remainingSubDoc } =
    validateTagsRecursive(nestedOpeningTag, subDocAfterTag);

  // Find closing match:

  if (!isValid) return { isValid, errorMessage };

  const hopefullyClosingMatch = findNextTag(subDocAfterOpening);
  if (matchAfterOpening === NO_TAGS_FOUND) {
    return { isValid: false, errorMessage: `Expected ${expectedClosingTag} but found #` };
  }

  // TODO finis hthis bit
}

/*
before

<A>

  between
</A>
after



before

<A>

  between
  <B>
    between2
  </B>
  between3
</A>
after
*/


module.exports = validateTags;

// TODO README
// TODO github repo
