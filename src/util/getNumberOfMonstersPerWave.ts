import { isBossWave } from "./isBossWave";

export const getNumberOfMonstersPerWave = (wave: number) => {
  if (isBossWave(wave)) {
    return 1;
  }
  return Math.min(20 + (wave - 1), 60);
};
