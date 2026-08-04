import { CeremonyState, CeremonyType, UserProvider } from "./declarations";
import { validateCreateTemplate, validateUpdateTemplate } from "./utils";

describe("ceremony template authProviders validation", () => {
  const validCreateTemplate = {
    projectId: 1,
    type: CeremonyType.PHASE2,
    state: CeremonyState.SCHEDULED,
    start_date: 1700000000,
    end_date: 1700003600,
    penalty: 0,
    authProviders: [UserProvider.GITHUB],
  };

  it("should accept a non-empty array of valid providers on create", () => {
    expect(() => validateCreateTemplate(validCreateTemplate)).not.toThrow();
  });

  it("should reject an empty authProviders array on create", () => {
    expect(() =>
      validateCreateTemplate({
        ...validCreateTemplate,
        authProviders: [],
      }),
    ).toThrow(/authProviders must be a non-empty array/);
  });

  it("should reject an unknown provider on create", () => {
    expect(() =>
      validateCreateTemplate({
        ...validCreateTemplate,
        authProviders: ["UNKNOWN"],
      }),
    ).toThrow(/authProviders must be a non-empty array/);
  });

  it("should reject the legacy boolean-map authProviders shape on create", () => {
    expect(() =>
      validateCreateTemplate({
        ...validCreateTemplate,
        authProviders: { github: true },
      }),
    ).toThrow(/authProviders must be a non-empty array/);
  });

  it("should accept a valid authProviders update", () => {
    expect(() =>
      validateUpdateTemplate({
        authProviders: [UserProvider.ETHEREUM],
      }),
    ).not.toThrow();
  });

  it("should reject an empty authProviders array on update", () => {
    expect(() =>
      validateUpdateTemplate({
        authProviders: [],
      }),
    ).toThrow(/authProviders must be a non-empty array/);
  });

  it("should allow updates that omit authProviders", () => {
    expect(() =>
      validateUpdateTemplate({
        description: "Updated only",
      }),
    ).not.toThrow();
  });
});
