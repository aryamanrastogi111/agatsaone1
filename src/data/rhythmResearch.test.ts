/// <reference types="bun" />
import { expect, test } from "bun:test";
import { RHYTHM_COHORTS } from "./rhythmResearch";

test("cross-device counts match the supplied research, without combining unique users", () => {
  expect(RHYTHM_COHORTS.map(({ users, observations }) => [users, observations])).toEqual([[145, 19379], [128, 83090]]);
  expect(RHYTHM_COHORTS.reduce((sum, item) => sum + item.observations, 0)).toBe(102469);
});

test("meal counts match the supplied manuscripts", () => {
  expect(RHYTHM_COHORTS.map(cohort => cohort.meals)).toEqual([3401, 3190]);
  expect(RHYTHM_COHORTS.reduce((sum, cohort) => sum + cohort.meals, 0)).toBe(6591);
});

test("primary meal-rise results use the reported primary denominators", () => {
  expect(RHYTHM_COHORTS.map(cohort => cohort.mealRise)).toEqual([
    { positive: 206, total: 333, percent: 61.9 },
    { positive: 1395, total: 2108, percent: 66.2 },
  ]);
});

test("post-peak decline results retain their own evaluable denominators", () => {
  expect(RHYTHM_COHORTS.map(cohort => cohort.recovery)).toEqual([
    { positive: 272, total: 298, percent: 91.3 },
    { positive: 1596, total: 2046, percent: 78.0 },
  ]);
});

test("timing sensitivity retains the shifted-window results", () => {
  expect(RHYTHM_COHORTS.map(cohort => cohort.shiftedMealRise)).toEqual([
    { positive: 200, total: 323, percent: 61.9 },
    { positive: 1349, total: 2124, percent: 63.5 },
  ]);
});

test("meal composition correlations match the reported weak associations", () => {
  expect(RHYTHM_COHORTS.map(cohort => cohort.carbohydrateCorrelation)).toEqual([-0.18, 0.03]);
});

test("rise fall and stable counts reconcile with each study transition total", () => {
  expect(RHYTHM_COHORTS.map(cohort => cohort.transitions.total)).toEqual([17156, 78475]);
  for (const { transitions, mealRise, recovery, shiftedMealRise } of RHYTHM_COHORTS) {
    expect(transitions.rise + transitions.fall + transitions.stable).toBe(transitions.total);
    for (const result of [mealRise, recovery, shiftedMealRise]) {
      expect(Number((100 * result.positive / result.total).toFixed(1))).toBe(result.percent);
    }
  }
});