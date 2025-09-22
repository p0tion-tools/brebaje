import { r1cs } from "snarkjs";
import { genesisZkeyIndex, potFileDownloadMainUrl, potFilenameTemplate } from "./constants";

/**
 * Calculate the smallest amount of Powers of Tau needed for a circuit with a constraint size.
 * @param constraints <number> - the number of circuit constraints (extracted from metadata).
 * @param outputs <number> - the number of circuit outputs (extracted from metadata)
 * @returns <number> - the smallest amount of Powers of Tau for the given constraint size.
 */
export const computeSmallestPowersOfTauForCircuit = (constraints: number, outputs: number) => {
  let power = 2;
  let tau = 2 ** power;

  while (constraints + outputs > tau) {
    power += 1;
    tau = 2 ** power;
  }

  return power;
};

/**
 * Return a string with double digits if the provided input is one digit only.
 * @param in <number> - the input number to be converted.
 * @returns <string> - the two digits stringified number derived from the conversion.
 */
export const convertToDoubleDigits = (amount: number): string =>
  amount < 10 ? `0${amount}` : amount.toString();

/**
 * Transform a number in a zKey index format.
 * @dev this method is aligned with the number of characters of the genesis zKey index (which is a constant).
 * @param progress <number> - the progression in zKey index.
 * @returns <string> - the progression in a zKey index format (`XYZAB`).
 */
export const formatZkeyIndex = (progress: number): string => {
  let index = progress.toString();

  // Pad with zeros if the progression has less digits.
  while (index.length < genesisZkeyIndex.length) {
    index = `0${index}`;
  }

  return index;
};

/**
 * Get the URL of the Powers of Tau file for a given R1CS file (using predefined root URL and filename template).
 * @param localR1csPath <string> - the local path to the r1cs file from which to extract the metadata.
 * @returns <Promise<string>> - the URL of the Powers of Tau file.
 */
export const getURLOfPowersOfTau = async (localR1csPath: string): Promise<string> => {
  const { nConstraints, nOutputs } = await r1cs.info(localR1csPath);
  const pot = computeSmallestPowersOfTauForCircuit(nConstraints, nOutputs);
  const doubleDigitsPowers = convertToDoubleDigits(pot);
  const smallestPowersOfTauCompleteFilename = `${potFilenameTemplate}${doubleDigitsPowers}.ptau`;

  return `${potFileDownloadMainUrl}${smallestPowersOfTauCompleteFilename}`;
};

/**
 * Extract the filename from a given URL.
 * @param url - The URL string
 * @returns The filename (e.g., "file.ptau")
 */
export const getFilenameFromUrl = (url: string): string => {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname.split("/").pop() || "";
};

/**
 * Extract a prefix consisting of alphanumeric and underscore characters from a string with arbitrary characters.
 * @dev replaces all special symbols and whitespaces with an underscore char ('_'). Convert all uppercase chars to lowercase.
 * @notice example: str = 'Multiplier-2!2.4.zkey'; output prefix = 'multiplier_2_2_4.zkey'.
 * NB. Prefix extraction is a key process that conditions the name of the ceremony artifacts, download/upload from/to storage, collections paths.
 * @param str <string> - the arbitrary string from which to extract the prefix.
 * @returns <string> - the resulting prefix.
 */
export const extractPrefix = (str: string): string =>
  // eslint-disable-next-line no-useless-escape
  str.replace(/[`\s~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "-").toLowerCase();
