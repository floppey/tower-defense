import { ArrowTower } from "../classes/towers/ArrowTower";
import { CannonTower } from "../classes/towers/CannonTower";
import { FireTower } from "../classes/towers/FireTower";
import { IceTower } from "../classes/towers/IceTower";
import { MageTower } from "../classes/towers/MageTower";
import Tower from "../classes/towers/Tower";
import { TowerType } from "../types/types";

export const prices: Record<TowerType, number> = {
  basic: 50,
  arrow: 100,
  cannon: 200,
  fire: 1000,
  ice: 450,
  mage: 7500,
} as const;

export const towerTypes: Record<TowerType, TowerType> = {
  basic: "basic",
  arrow: "arrow",
  cannon: "cannon",
  fire: "fire",
  ice: "ice",
  mage: "mage",
} as const;

export const TowerClasses: Record<TowerType, typeof Tower> = {
  basic: Tower,
  arrow: ArrowTower,
  cannon: CannonTower,
  mage: MageTower,
  ice: IceTower,
  fire: FireTower,
};
