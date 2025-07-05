'use strict';

const actions = require('..');
const assert = require('assert').strict;

assert.strictEqual(actions(), 'Hello from actions');
console.info('actions tests passed');
