export interface BoundedSineParams {
  /**
   * The value of `fx(0)` before translations.
   * @defaultValue 0
   */
  yStart?: number;
  /**
   * The minimum y-value.
   * @defaultValue -1
   */
  yMin?: number;
  /**
   * The maximum y-value.
   * @defaultValue 1
   */
  yMax?: number;
  /**
   * The length of one cycle of the curve.
   * @defaultValue 1
   */
  period?: number;
  /**
   * Translation applied in the x-direction.
   * @defaultValue 0
   */
  translateX?: number;
  /**
   * Translation applied in the y-direction.
   * @defaultValue 0
   */
  translateY?: number;
  /**
   * Inverts the sine function.
   * @defaultValue false
   */
  invert?: boolean;
}

export type BoundedSineFunction = (n: number) => number;

/**
 * Returns a sine function fx such that fx(0) = yStart,
 * and yMin \<= fx(x) \<= yMax.
 */
export const boundedSine = ({
  yStart = 0,
  yMin = -1,
  yMax = 1,
  period = 1,
  translateX = 0,
  translateY = 0,
  invert = false
}: BoundedSineParams = {}): BoundedSineFunction => {
  if (yStart < yMin || yStart > yMax) {
    throw new Error("yStart must be between yMin and yMax");
  }
  const TAU = 2 * Math.PI;
  const average = (yMin + yMax) / 2;
  const amplitude = (yMax - yMin) / 2;
  const invertFactor = invert ? -1 : 1;
  const phaseShift =
    Math.asin((2 * (yStart - yMin)) / (yMax - yMin) - 1) * (period / TAU);
  return (n: number) =>
    average +
    amplitude *
      Math.sin((invertFactor * (TAU * (n - translateX + phaseShift))) / period) +
    translateY;
};
