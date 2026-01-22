import { afterEach, describe, expect, it } from "vitest";
import {
  getDyadProApiKey,
  hasDyadProKey,
  isDyadProEnabled,
  type UserSettings,
} from "@/lib/schemas";
import { DEFAULT_TEMPLATE_ID } from "@/shared/templates";

const baseSettings: UserSettings = {
  selectedModel: { name: "auto", provider: "auto" },
  providerSettings: {},
  telemetryConsent: "unset",
  telemetryUserId: "test-id",
  hasRunBefore: false,
  experiments: {},
  enableDyadPro: true,
  enableProLazyEditsMode: true,
  enableProSmartFilesContextMode: true,
  selectedChatMode: "build",
  enableAutoFixProblems: false,
  enableAutoUpdate: true,
  releaseChannel: "stable",
  selectedTemplateId: DEFAULT_TEMPLATE_ID,
  isRunning: false,
  enableNativeGit: true,
};

const originalProKey = process.env.DYAD_PRO_API_KEY;

afterEach(() => {
  if (originalProKey === undefined) {
    delete process.env.DYAD_PRO_API_KEY;
  } else {
    process.env.DYAD_PRO_API_KEY = originalProKey;
  }
});

describe("Dyad Pro helpers", () => {
  it("uses environment Dyad Pro key when settings do not include one", () => {
    process.env.DYAD_PRO_API_KEY = "env-key";
    const settings: UserSettings = {
      ...baseSettings,
      providerSettings: {},
    };

    expect(getDyadProApiKey(settings)).toBe("env-key");
    expect(hasDyadProKey(settings)).toBe(true);
    expect(isDyadProEnabled(settings)).toBe(true);
  });

  it("reports Pro as available even when no key is configured", () => {
    delete process.env.DYAD_PRO_API_KEY;
    const settings: UserSettings = {
      ...baseSettings,
      providerSettings: {},
    };

    expect(getDyadProApiKey(settings)).toBeUndefined();
    expect(hasDyadProKey(settings)).toBe(true);
    expect(isDyadProEnabled(settings)).toBe(true);
  });

  it("prefers stored Dyad Pro key over environment value", () => {
    process.env.DYAD_PRO_API_KEY = "env-key";
    const settings: UserSettings = {
      ...baseSettings,
      providerSettings: { auto: { apiKey: { value: "stored-key" } } },
    };

    expect(getDyadProApiKey(settings)).toBe("stored-key");
    expect(hasDyadProKey(settings)).toBe(true);
    expect(isDyadProEnabled(settings)).toBe(true);
  });
});
