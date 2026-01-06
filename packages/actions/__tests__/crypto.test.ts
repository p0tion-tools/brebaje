import { strictEqual } from "node:assert";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { calculateBlake2bHash } from "src/helpers/crypto";

const expectedHash =
  "021ced8799296ceca557832ab941a50b4a11f83478cf141f51f933f653ab9fbcc05a037cddbed06e309bf334942c4e58cdf1a46e237911ccd7fcf9787cbc7fd0";

const run = async () => {
  // Validate hashing from a Uint8Array input (browser-compatible)
  const uint8Hash = await calculateBlake2bHash(new TextEncoder().encode("hello world"));
  strictEqual(uint8Hash, expectedHash);

  // Validate hashing from a file path (Node.js)
  const tempDir = mkdtempSync(join(tmpdir(), "brebaje-actions-crypto-"));
  const filePath = join(tempDir, "hello.txt");
  writeFileSync(filePath, "hello world");

  const fileHash = await calculateBlake2bHash(filePath);
  strictEqual(fileHash, expectedHash);

  console.info("crypto tests passed");
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
