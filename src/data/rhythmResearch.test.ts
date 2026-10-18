import { expect, test } from "bun:test";
import { RHYTHM_COHORTS } from "./rhythmResearch";

test("cross-device counts match the supplied research, without combining unique users", () => {
  expect(RHYTHM_COHORTS.map(({ users, observations }) => [users, observations])).toEqual([[145, 19379], [128, 83090], [28, 2939]]);
  expect(RHYTHM_COHORTS.reduce((sum, item) => sum + item.observations, 0)).toBe(105408);
});