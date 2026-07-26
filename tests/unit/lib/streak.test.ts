import { describe, it, expect } from "vitest";
import { isStreakAtRisk } from "@/lib/streak";

describe("isStreakAtRisk", () => {
  it("returns false when lastActivityAt is null", () => {
    expect(isStreakAtRisk(null)).toBe(false);
  });

  it("returns true when last activity was yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isStreakAtRisk(yesterday.toISOString())).toBe(true);
  });

  it("returns false when last activity is today", () => {
    const today = new Date();
    expect(isStreakAtRisk(today.toISOString())).toBe(false);
  });
});
