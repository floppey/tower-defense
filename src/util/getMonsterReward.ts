import { isBossWave } from "./isBossWave";

export const getMonsterReward = (wave: number) => {
  if (isBossWave(wave)) {
    return Math.floor(1000 * (wave / 10));
  }
  return 10 + Math.floor(wave / 1.25);
};
