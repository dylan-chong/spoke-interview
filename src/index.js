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

const isClosingTag = (tag) => tag.indexOf('/') !== -1;

const validateTagsRecursive = (tags) => {
  console.log('validateTagsRecursive', {tags})

  // Empty document (or no more tags inside a pair)
  if (tags.length === 0) {
    return { isValid: true, message: 'Correctly tagged paragraph', remainingTags: [] };
  }

  // We need to start with an opening tag, not a closing one
  if (isClosingTag(tags[0])) {
    return {
      isValid: false,
      message: `Expected # but found ${tags[0]}`
    };
  }

  return validateTagsRecursiveWithOpening(tags[0], tags.slice(1));
}

const validateTagsRecursiveWithOpening = (openingTag, tagsAfterOpening) => {
  console.log('validateTagsRecursiveWithOpening', {openingTag, tagsAfterOpening})
  const expectedClosingTag = openingTag.replace('<', '</');

  // No more tags, missing the closing one
  if (tagsAfterOpening.length === 0) {
    return {
      isValid: false,
      message: `Expected ${expectedClosingTag} but found #`
    };
  }

  // Close comes immediately after opening. Continue as open/close pair have been found
  if (tagsAfterOpening[0] === expectedClosingTag) {
    return { isValid: true, remainingTags: tagsAfterOpening.slice(1) };
  }

  // Closing tag is not expectedClosingTag, so is a stray one
  if (isClosingTag(tagsAfterOpening[0])) {
    return {
      isValid: false,
      message: `Expected # but found ${openingTag}`
    };
  }

  // tagsAfterOpening[0] must be a nested opening tag at this point.
  // Recurse to find subdocuments
  const { isValid, message, remainingTags } =
    validateTagsRecursiveWithOpening(tagsAfterOpening[0], tagsAfterOpening.slice(1));
  if (!isValid) {
    return { isValid: false, message };
  }

  // After recursion, we should expect to see either the expectedClosingTag or
  // another openingTag. Eerily, we can just recurse as this is a similar
  // position to the start of the document. We have already advanced by at
  // least 1 position in the array of tags so this won't loop infinitely
  return validateTagsRecursiveWithOpening(openingTag, remainingTags);
};

module.exports = validateTags;

// TODO README
// TODO github repo
// TODO tests from doc
