import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { calculateBlake2bHash } from "src/helpers/crypto";

const EXPECTED_HASH =
  "021ced8799296ceca557832ab941a50b4a11f83478cf141f51f933f653ab9fbcc05a037cddbed06e309bf334942c4e58cdf1a46e237911ccd7fcf9787cbc7fd0";

describe("Crypto Helpers", () => {
  describe("calculateBlake2bHash", () => {
    it("should calculate correct hash from Uint8Array", async () => {
      const uint8Hash = await calculateBlake2bHash(new TextEncoder().encode("hello world"));

      expect(uint8Hash).toBe(EXPECTED_HASH);
    });

    it("should calculate correct hash from file", async () => {
      const tempDir = mkdtempSync(join(tmpdir(), "brebaje-actions-crypto-"));
      const filePath = join(tempDir, "hello.txt");

      writeFileSync(filePath, "hello world");

      const fileHash = await calculateBlake2bHash(filePath);

      rmSync(tempDir, { recursive: true, force: true });

      expect(fileHash).toBe(EXPECTED_HASH);
    });
  });
});
