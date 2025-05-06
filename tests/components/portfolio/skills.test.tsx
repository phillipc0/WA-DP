import { getColorForSkill } from "@/components/portfolio/skills";

describe("getColorForSkill", () => {
  const expected = ["primary", "secondary", "success", "warning", "danger"];

  it("returns the colors cyclically correctly", () => {
    for (let i = 0; i < 12; i++) {
      const color = getColorForSkill(i);

      expect(color).toBe(expected[i % expected.length]);
    }
  });
});
