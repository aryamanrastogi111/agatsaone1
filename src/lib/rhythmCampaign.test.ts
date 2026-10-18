/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import { getRhythmAngle, selectRhythmAngle, getRhythmAttribution, RHYTHM_CAMPAIGNS, getRhythmExperience } from "./rhythmCampaign";

describe("Rhythm campaign rules", () => {
  test("the default hero stays fixed for every selected goal and campaign link", () => {
    const initial = getRhythmExperience("");
    expect(initial.selectedGoal).toBeNull();
    for (const angle of ["weight", "food", "sugar"] as const) {
      const direct = getRhythmExperience(`?angle=${angle}`);
      const selected = getRhythmExperience(selectRhythmAngle("?utm_source=facebook", angle));
      expect(direct.hero).toBe(initial.hero);
      expect(selected.hero).toBe(initial.hero);
      expect(selected.selectedGoal).toBe(angle);
    }
    expect(getRhythmExperience("?angle=invalid").selectedGoal).toBeNull();
  });
  test("only the three requested angles select a campaign", () => {
    expect(["weight", "food", "sugar"].map(angle => getRhythmAngle(`?angle=${angle}`))).toEqual(["weight", "food", "sugar"]);
    expect(getRhythmAngle("?angle=other")).toBeNull();
    expect(getRhythmAngle("")).toBeNull();
  });
  test("goal selection preserves original UTM and product parameters", () => {
    const result = new URLSearchParams(selectRhythmAngle("?utm_source=facebook&utm_campaign=october&sku=band_sub&angle=weight", "food"));
    expect(result.get("utm_source")).toBe("facebook");
    expect(result.get("utm_campaign")).toBe("october");
    expect(result.get("sku")).toBe("band_sub");
    expect(result.get("angle")).toBe("food");
  });
  test("attribution uses neutral campaign codes rather than health goals", () => {
    expect(getRhythmAttribution("?angle=sugar&utm_source=facebook")).toEqual({ campaignCode: "r03", source: "facebook", medium: null, campaign: null, content: null });
  });
  test("campaign selection cannot override commercial terms", () => {
    for (const campaign of Object.values(RHYTHM_CAMPAIGNS)) {
      expect(Object.keys(campaign).sort()).toEqual(["code", "copy", "explanation", "goal", "headline"]);
    }
  });
});