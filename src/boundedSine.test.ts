import { boundedSine, BoundedSineFunction } from "./boundedSine";

let fn: BoundedSineFunction = boundedSine();

test("defaults", () => {
  fn = boundedSine();
  expect(fn(0)).toBeCloseTo(0);
  expect(fn(0.25)).toBeCloseTo(1);
  expect(fn(0.5)).toBeCloseTo(0);
  expect(fn(0.75)).toBeCloseTo(-1);
  expect(fn(1)).toBeCloseTo(0);
});

test("defaults (invert)", () => {
  fn = boundedSine({ invert: true });
  expect(fn(0)).toBeCloseTo(0);
  expect(fn(0.25)).toBeCloseTo(-1);
  expect(fn(0.5)).toBeCloseTo(0);
  expect(fn(0.75)).toBeCloseTo(1);
  expect(fn(1)).toBeCloseTo(0);
});

describe("yBounds", () => {
  /**
   * This function is only a valid test if yStart = (yMin + yMax) / 2 and
   * translateX = translateY = 0.
   */
  const testInflectionPoints = (
    fn: BoundedSineFunction,
    yStart: number,
    yMin: number,
    yMax: number,
    period: number
  ) => {
    expect(fn(period * 0)).toBeCloseTo(yStart);
    expect(fn(period * 0.25)).toBeCloseTo(yMax);
    expect(fn(period * 0.5)).toBeCloseTo(yStart);
    expect(fn(period * 0.75)).toBeCloseTo(yMin);
    expect(fn(period * 1)).toBeCloseTo(yStart);
  };

  test("negative and positive bounds", () => {
    const period = Math.random() * 100;
    const yStart = 0;
    const yMin = -5;
    const yMax = 5;
    fn = boundedSine({ yMin, yMax, yStart, period });
    testInflectionPoints(fn, yStart, yMin, yMax, period);
  });

  test("positive bounds", () => {
    const period = Math.random() * 100;
    const yStart = 15;
    const yMin = 10;
    const yMax = 20;
    fn = boundedSine({ yMin, yMax, yStart, period });
    testInflectionPoints(fn, yStart, yMin, yMax, period);
  });

  test("negative bounds", () => {
    const period = Math.random() * 100;
    const yStart = -15;
    const yMin = -20;
    const yMax = -10;
    fn = boundedSine({ yMin, yMax, yStart, period });
    testInflectionPoints(fn, yStart, yMin, yMax, period);
  });
});

test("yStart, yTranslate, xTranslate, period", () => {
  const testYStart = (
    fn: BoundedSineFunction,
    yStart: number,
    yTranslate: number,
    xTranslate: number,
    period: number
  ) => {
    expect(fn(xTranslate)).toBeCloseTo(yStart + yTranslate);
    expect(fn(xTranslate + period)).toBeCloseTo(yStart + yTranslate);
  };

  const SCALE = 10;

  for (let i = 0; i < 10; i++) {
    const yStart = Math.random() * SCALE;
    const yMin = yStart - Math.random() * SCALE;
    const yMax = yStart + Math.random() * SCALE;
    const translateX = Math.random() * SCALE;
    const translateY = Math.random() * SCALE;
    const period = Math.random() * SCALE;
    const fn = boundedSine({ yStart, yMin, yMax, translateX, translateY, period });
    testYStart(fn, yStart, translateY, translateX, period);
  }
});

describe("valid yStart", () => {
  test("throws error", () => {
    expect(() => boundedSine({ yMin: 0, yMax: 5, yStart: -1 })).toThrow(
      "yStart must be between yMin and yMax"
    );
    expect(() => boundedSine({ yMin: 6, yMax: 5, yStart: -1 })).toThrow(
      "yStart must be between yMin and yMax"
    );
  });
  test("does not throw error", () => {
    expect(() => boundedSine({ yMin: 0, yMax: 5, yStart: 0 }));
    expect(() => boundedSine({ yMin: 6, yMax: 5, yStart: 5 }));
  });
});
