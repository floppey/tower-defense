import { towerStats, TowerStats, TowerType } from "../constants/towers";

export const getTowerStat = (
  type: TowerType,
  stat: keyof TowerStats,
  level: number
) => {
  if (level < 1) {
    throw new Error("Level must be 1 or greater");
  }

  const baseValue = towerStats[type][stat];

  if (typeof baseValue !== "number" || level === 1) {
    return baseValue ?? null;
  }

  const multiplier = getMultiplier(type, stat, level);
  const newValue = Math.max(baseValue * multiplier, baseValue);
  return Number(newValue.toFixed(2));
};

const getMultiplier = (
  type: TowerType,
  stat: keyof TowerStats,
  level: number
): number => {
  switch (stat) {
    case "range":
      if (["support-range", "support-damage"].includes(type)) {
        const rangeMultiplier = level;
        return rangeMultiplier;
      }
      const rangeMultiplier = Math.round(Math.pow(1.1, level - 1));
      return rangeMultiplier;
    case "damage":
      const levelMultiplier = Math.round(Math.pow(1.5, level - 1));

      return levelMultiplier;
    case "attackSpeed":
      if (["basic", "arrow", "mage"].includes(type)) {
        const levelMultiplier = Math.pow(1.1, level - 1);
        return levelMultiplier;
      }
      if (["fire", "lightning", "cannon"].includes(type)) {
        const levelMultiplier = Math.pow(1.05, level - 1);
        return levelMultiplier;
      }
      if (["ice"].includes(type)) {
        const levelMultiplier = Math.pow(1.25, level - 1);
        return levelMultiplier;
      }
      return 1;
    case "splash":
      if (["cannon"].includes(type)) {
        const levelMultiplier = Math.pow(1.1, level - 1);
        return levelMultiplier;
      }
      if (["ice", "fire"].includes(type)) {
        const levelMultiplier = Math.pow(1.05, level - 1);
        return levelMultiplier;
      }
      return 1;
    default:
      return 1;
  }
};
