export const monsterTypes = [
  "plant",
  "skeleton",
  "orcWarrior",
  "fireSpirit",
] as const;

export type MonsterType = (typeof monsterTypes)[number];
