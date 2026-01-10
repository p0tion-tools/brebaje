/**
 * Checks if the user is a coordinator for a specific ceremony.
 * @param accessToken - The authentication token.
 * @param ceremonyId - The ID of the ceremony.
 * @returns A promise that resolves to a boolean indicating if the user is a coordinator.
 */
export const isCoordinatorAPI = async (accessToken: string, ceremonyId: number) => {
  const url = new URL(`${process.env.API_URL}/ceremonies/is-coordinator`);
  url.search = new URLSearchParams({ ceremonyId: ceremonyId.toString() }).toString();
  const result = (await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json())) as { isCoordinator: boolean };
  return result.isCoordinator;
};

/**
 * Formats a message for SIWE (Sign-In with Ethereum).
 * @param message - The message to format.
 * @returns The formatted message
 * (without leading whitespace but preserved blank lines except start and end blank lines).
 */
export const formatMessageForSIWE = (message: string) => {
  return message.replace(/^[ \t]+/gm, "").trim();
};
