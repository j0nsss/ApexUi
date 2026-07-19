import { describe, it, expect } from "vitest";
import { interpolate } from "./interpolate";

describe("interpolate", () => {
  it("replaces single param", () => {
    expect(interpolate("Hello {{name}}", { name: "World" })).toBe("Hello World");
  });

  it("replaces multiple params", () => {
    expect(interpolate("{{greeting}}, {{name}}!", { greeting: "Hi", name: "Alice" })).toBe(
      "Hi, Alice!",
    );
  });

  it("replaces numeric values", () => {
    expect(interpolate("width: {{size}}px", { size: 48 })).toBe("width: 48px");
  });

  it("replaces boolean values", () => {
    expect(interpolate("{{flag}}", { flag: true })).toBe("true");
  });

  it("handles missing key by leaving placeholder", () => {
    expect(interpolate("{{a}} {{b}}", { a: "x" })).toBe("x {{b}}");
  });

  it("handles numeric zero", () => {
    expect(interpolate("{{value}}", { value: 0 })).toBe("0");
  });

  it("handles false boolean", () => {
    expect(interpolate("{{value}}", { value: false })).toBe("false");
  });

  it("returns template unchanged when no placeholders", () => {
    expect(interpolate("no placeholders", { a: "x" })).toBe("no placeholders");
  });

  it("returns empty string for empty template", () => {
    expect(interpolate("", { a: "x" })).toBe("");
  });

  it("replaces same param multiple times", () => {
    expect(interpolate("{{x}} + {{x}} = {{y}}", { x: 1, y: 2 })).toBe("1 + 1 = 2");
  });
});
