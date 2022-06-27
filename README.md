# Tag Checker

Validates that all the tags in a given piece of text (a paragraph) are
correctly nested, and that there are no missing or extra tags.

## Setup

- `nvm install` or other method of installing Node (version in `./.nvmrc`)
- `yarn install`

## Manually executing

- `node`
- `const validateTags = require('./src/index.js')`
- `validateTags('my document <A>tag</A>')`

## Testing

- `yarn test` to run Jest tests (can add `--watch`)
