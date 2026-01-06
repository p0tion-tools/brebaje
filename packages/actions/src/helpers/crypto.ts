import { blake2b } from "@noble/hashes/blake2b";
import { bytesToHex } from "@noble/hashes/utils";
import { readFile } from "fs/promises";

type Blake2bInput = string | Uint8Array | ArrayBuffer;

const toUint8Array = async (input: Blake2bInput): Promise<Uint8Array> => {
  if (typeof input === "string") {
    return readFile(input);
  }

  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input);
  }

  return input;
};

/**
 * Calculate the Blake2b hash of a file or byte array.
 * @param input - The file path (Node.js) or byte array (Node.js/Browser) to hash.
 * @returns The hex-encoded Blake2b hash.
 */
export const calculateBlake2bHash = async (input: Blake2bInput): Promise<string> => {
  const data = await toUint8Array(input);
  // Explicitly use 512-bit (64-byte) output for consistency across consumers.
  return bytesToHex(blake2b(data, { dkLen: 64 }));
};
