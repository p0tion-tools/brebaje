// import { getBucketName, sanitizeString, genesisZkeyIndex } from "../build/index.js";
import { strictEqual } from "node:assert";
import { genesisZkeyIndex } from "src/helpers/constants";
import { getBucketName } from "src/helpers/storage";
import { sanitizeString } from "src/helpers/utils";

// Test getBucketName function
const bucketName = getBucketName("test-postfix", "MyProject", "My Ceremony");
strictEqual(bucketName, "myproject-my-ceremony-test-postfix");

// Test sanitizeString function
const sanitized = sanitizeString("Test String!@#");
strictEqual(sanitized, "test-string---");

// Test genesisZkeyIndex constant
strictEqual(genesisZkeyIndex, "00000");

console.info("actions tests passed");
