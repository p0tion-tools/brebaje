import { sanitizeString } from "src/helpers/utils";

describe("Utils Tests", () => {
  describe("sanitizeString", () => {
    it("should sanitize input strings", () => {
      const result = sanitizeString("Test String!@#");
      expect(result).toBe("test-string---");
    });
  });
});
