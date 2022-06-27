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
  const { isValid, message } = validateTagsRecursive(tags);

  if (isValid) {
    return { isValid: true, message: 'Correctly tagged paragraph' };
  } else {
    return { isValid: false, message };
  }
  // TODO prints output
};

const validateTagsRecursive = (tagsAfterOpening) => {
  if (tagsAfterOpening.length === 0)
    return { isValid: true };

  // We have to start with an opening tag
  if (isClosingTag(tagsAfterOpening[0]))
    return {
      isValid: false,
      message: `Expected # but found ${tagsAfterOpening[0]}`
    };

  const openingTag = tagsAfterOpening[0];
  const expectedClosingTag = openingTag.replace('<', '</');

  // Make sure there is an closing tag for the opening one
  if (tagsAfterOpening.length < 2)
    return {
      isValid: false,
      message: `Expected ${expectedClosingTag} but found #`
    };

  const actualClosingTag = tagsAfterOpening[tagsAfterOpening.length - 1];

  if (expectedClosingTag !== actualClosingTag)
    return {
      isValid: false,
      message: `Expected ${expectedClosingTag} but found ${actualClosingTag}`
    };

  // Recurse on the tags 'inside' the outermost pair
  return validateTagsRecursive(tagsAfterOpening.slice(1, tagsAfterOpening.length - 1));
};

const isClosingTag = (tag) => tag.indexOf('/') !== -1


module.exports = validateTags;

// TODO README
// TODO github repo
// TODO tests from doc
