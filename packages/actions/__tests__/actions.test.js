"use strict";

const { getBucketName, sanitizeString, genesisZkeyIndex } = require("..");
const assert = require("assert").strict;

// Test getBucketName function
const bucketName = getBucketName("test-postfix", "MyProject", "My Ceremony");
assert.strictEqual(bucketName, "myproject-my-ceremony-test-postfix");

// Test sanitizeString function
const sanitized = sanitizeString("Test String!@#");
assert.strictEqual(sanitized, "test-string---");

// Test genesisZkeyIndex constant
assert.strictEqual(genesisZkeyIndex, "00000");

console.info("actions tests passed");
