import { COLORS } from "../../constants/colors";
import {
    formatPrice,
    getDistance,
    getPriceCategory,
    getPriceColor,
} from "../../utils/priceHelpers";

describe("priceHelpers", () => {
  describe("getPriceCategory", () => {
    test("below cheap threshold is cheap", () => {
      expect(getPriceCategory(1.5)).toBe("cheap");
    });

    test("exactly 1.80 is mid", () => {
      expect(getPriceCategory(1.8)).toBe("mid");
    });

    test("exactly 2.50 is expensive", () => {
      expect(getPriceCategory(2.5)).toBe("expensive");
    });

    test("above expensive threshold is expensive", () => {
      expect(getPriceCategory(3.0)).toBe("expensive");
    });
  });

  describe("getPriceColor", () => {
    test("maps cheap to green", () => {
      expect(getPriceColor(1.2)).toBe(COLORS.green);
    });

    test("maps mid to amber", () => {
      expect(getPriceColor(1.8)).toBe(COLORS.amber);
    });

    test("maps expensive to red", () => {
      expect(getPriceColor(2.5)).toBe(COLORS.red);
    });
  });

  describe("formatPrice", () => {
    test("formats decimals and euro sign", () => {
      expect(formatPrice(1)).toBe("€1.00");
      expect(formatPrice(1.234)).toBe("€1.23");
    });
  });

  describe("getDistance", () => {
    test("returns 0m for identical coordinates", () => {
      expect(getDistance(41.3917, 2.1649, 41.3917, 2.1649)).toBe("0m");
    });

    test("returns meters for short distances", () => {
      const d = getDistance(41.3917, 2.1649, 41.3937, 2.1649); // ~222m
      expect(d.endsWith("m")).toBe(true);
      const num = parseFloat(d.replace("m", ""));
      expect(num).toBeGreaterThan(100);
      expect(num).toBeLessThan(400);
    });

    test("returns km for long distances", () => {
      const d = getDistance(41.3917, 2.1649, 41.4817, 2.1649); // ~10km
      expect(d.endsWith("km")).toBe(true);
      // one decimal
      expect(d.match(/^[0-9]+\.[0-9]km$/)).not.toBeNull();
    });
  });
});
