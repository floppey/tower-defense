import Tower from "../classes/towers/Tower";
import { prices } from "../constants/towers";

export const getTowerUpgradeCost = (tower: Tower) => {
  return Math.round(prices[tower.type] * Math.pow(1.5, tower.level + 1));
};
