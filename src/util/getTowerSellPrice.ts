import Tower from "../classes/towers/Tower";
import { prices } from "../constants/towers";
import { getUpgradeCost } from "./getTowerUpgradeCost";

export const getTowerSellPrice = (tower: Tower) => {
  let basePrice = prices[tower.type];

  for (let i = 1; i < tower.level; i++) {
    basePrice += getUpgradeCost(tower.type, i);
  }

  return Math.round(basePrice / 2);
};
