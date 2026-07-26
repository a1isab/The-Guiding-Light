import { describe, it, expect } from "vitest";
import { getTranslation, getQuizQuestion } from "@/lib/types";

describe("getTranslation", () => {
  const obj = {
    name: "Hello",
    translations: {
      ar: { name: "مرحبا" },
      fr: { name: "Bonjour" },
    },
  };

  it("returns translated value when locale matches", () => {
    expect(getTranslation(obj, "name", "ar")).toBe("مرحبا");
    expect(getTranslation(obj, "name", "fr")).toBe("Bonjour");
  });

  it("returns fallback when locale has no translation", () => {
    expect(getTranslation(obj, "name", "ur")).toBe("Hello");
  });

  it("returns fallback when no translations exist", () => {
    expect(getTranslation({ name: "Test" }, "name", "ar")).toBe("Test");
  });
});

describe("getQuizQuestion", () => {
  const q = {
    question: "What is Tawheed?",
    options: ["A", "B", "C", "D"],
    correct: 0,
    question_ar: "ما هو التوحيد؟",
    options_ar: ["أ", "ب", "ج", "د"],
  };

  it("returns English by default", () => {
    const result = getQuizQuestion(q, "en");
    expect(result.question).toBe("What is Tawheed?");
    expect(result.options).toEqual(["A", "B", "C", "D"]);
  });

  it("returns Arabic when locale is ar", () => {
    const result = getQuizQuestion(q, "ar");
    expect(result.question).toBe("ما هو التوحيد؟");
    expect(result.options).toEqual(["أ", "ب", "ج", "د"]);
  });

  it("falls back to English when locale translation is missing", () => {
    const result = getQuizQuestion(q, "ur");
    expect(result.question).toBe("What is Tawheed?");
    expect(result.options).toEqual(["A", "B", "C", "D"]);
  });
});
