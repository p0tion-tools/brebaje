import { create } from "./create";
import * as utils from "./utils";
import { ScriptLogger } from "../utils/logger";
import { authenticatedFetch } from "../auth/http";
import { CeremonyCreate, CeremonyType, CeremonyState } from "./declarations";

jest.mock("../utils/logger");
jest.mock("./utils");
jest.mock("../auth/http");

const mockLogger = {
  log: jest.fn(),
  success: jest.fn(),
  failure: jest.fn(),
};

(ScriptLogger as any).mockImplementation(() => mockLogger);

describe("create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should read and validate the template, then call authenticatedFetch and log success", async () => {
    const template: CeremonyCreate = {
      projectId: 1,
      type: CeremonyType.PHASE2,
      state: CeremonyState.SCHEDULED,
      start_date: 1700000000,
      end_date: 1700003600,
      penalty: 0,
      authProviders: { github: true },
    };
    (utils.readTemplate as jest.Mock).mockReturnValue(template);
    (utils.validateCreateTemplate as jest.Mock).mockReturnValue(undefined);
    (authenticatedFetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ...template, id: 42 }),
    } as any);

    await create({ template: "test.json" });

    expect(utils.readTemplate).toHaveBeenCalledWith("test.json");
    expect(utils.validateCreateTemplate).toHaveBeenCalledWith(template);
    expect(authenticatedFetch).toHaveBeenCalledWith(
      "/ceremonies",
      expect.objectContaining({ method: "POST" }),
    );
    expect(mockLogger.success).toHaveBeenCalledWith("Ceremony created successfully!");
    expect(mockLogger.log).toHaveBeenCalledWith("   ID: 42");
  });

  it("should log failure if template validation throws", async () => {
    (utils.readTemplate as jest.Mock).mockReturnValue({});
    (utils.validateCreateTemplate as jest.Mock).mockImplementation(() => {
      throw new Error("bad template");
    });

    await create({ template: "bad.json" });

    expect(mockLogger.failure).toHaveBeenCalledWith("Error: bad template");
  });

  it("should log failure if API returns error", async () => {
    const template: CeremonyCreate = {
      projectId: 1,
      type: CeremonyType.PHASE2,
      state: CeremonyState.SCHEDULED,
      start_date: 1700000000,
      end_date: 1700003600,
      penalty: 0,
      authProviders: { github: true },
    };
    (utils.readTemplate as jest.Mock).mockReturnValue(template);
    (utils.validateCreateTemplate as jest.Mock).mockReturnValue(undefined);
    (authenticatedFetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => "Bad Request",
    } as any);

    await create({ template: "test.json" });

    expect(mockLogger.failure).toHaveBeenCalledWith("Failed to create ceremony: 400 Bad Request");
  });
});
