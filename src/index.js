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
    throw new Error('Invalid document. Expected a string')



  return true
};



module.exports = validateTags;

// TODO README
// TODO github repo
// TODO prints output
