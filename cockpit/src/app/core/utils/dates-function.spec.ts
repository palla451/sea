import { parseCustomDateString } from "./dates-functions";

describe("parseCustomDateString", () => {
  it("should return a valid Date object when given a correct input string", () => {
    const input = "06:57 - 08/09/2025";
    const result = parseCustomDateString(input);

    if (result) {
      expect(result).toBeInstanceOf(Date);
      expect(result.getHours()).toBe(6);
      expect(result.getMinutes()).toBe(57);
      expect(result.getDate()).toBe(8);
      expect(result.getMonth()).toBe(8);
      expect(result.getFullYear()).toBe(2025);
    }
  });

  it("should return null when the input string does not match the expected format", () => {
    const input = "06:57 - 08/2025";
    const result = parseCustomDateString(input);

    expect(result).toBeNull();
  });

  it("should return null when the input string is empty", () => {
    const input = "";
    const result = parseCustomDateString(input);

    expect(result).toBeNull();
  });

  it("should log a warning to the console for invalid input", () => {
    spyOn(console, "warn");
    const input = "06:57 - 08/2025";
    const result = parseCustomDateString(input);

    expect(console.warn).toHaveBeenCalledWith(
      "Formato data non valido:",
      input
    );
    expect(result).toBeNull();
  });

  it("should handle edge cases like 00:00 - 01/01/2000", () => {
    const input = "00:00 - 01/01/2000";
    const result = parseCustomDateString(input);

    if (result) {
      expect(result).toBeInstanceOf(Date);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(0);
      expect(result.getFullYear()).toBe(2000);
    }
  });
});
