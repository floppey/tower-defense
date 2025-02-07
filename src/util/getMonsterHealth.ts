import { getNumberOfMonstersPerWave } from "./getNumberOfMonstersPerWave";
import { isBossWave } from "./isBossWave";

export const getMonsterHealth = (wave: number) => {
  const baseHealth = 100;
  const baseHealthIncrease = 50;
  let healthIncrease = 0;
  for (let i = 0; i < wave; i += 1) {
    healthIncrease += baseHealthIncrease * (i * 2);
    healthIncrease += Math.pow(i, 1.5 + Math.floor(i / 50) / 2);
  }
  if (isBossWave(wave)) {
    healthIncrease *= getNumberOfMonstersPerWave(wave - 1) / 2;
  }
  return Math.floor(baseHealth + healthIncrease);
};
