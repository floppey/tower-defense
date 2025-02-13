import Tower from "../classes/towers/Tower";
import { prices, TowerType } from "../constants/towers";

export const getTowerUpgradeCost = (tower: Tower) => {
  return getUpgradeCost(tower.type, tower.level);
};

export const getUpgradeCost = (towerType: TowerType, level: number) => {
  return Math.round(prices[towerType] * Math.pow(1.5, level + 1));
};
