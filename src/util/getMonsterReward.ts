import { isBossWave } from "./isBossWave";

export const getMonsterReward = (wave: number) => {
  if (isBossWave(wave)) {
    return Math.floor(1000 * (wave / 10));
  }
  // Use exponential scaling for higher waves
  return Math.floor(10 + wave * 2 + Math.pow(wave, 1.25));
};
