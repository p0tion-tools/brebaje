import { getBucketName } from "src/helpers/storage";

describe("Storage Helpers", () => {
  describe("getBucketName", () => {
    it("should generate correct bucket name", () => {
      const result = getBucketName("postfix", "Project Name", "Ceremony Name");

      expect(result).toBe("project-name-ceremony-name-postfix");
    });
  });
});
