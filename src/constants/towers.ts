import { ArrowTower } from "../classes/towers/ArrowTower";
import { CannonTower } from "../classes/towers/CannonTower";
import { FireTower } from "../classes/towers/FireTower";
import { IceTower } from "../classes/towers/IceTower";
import { LightningTower } from "../classes/towers/LightningTower";
import { MageTower } from "../classes/towers/MageTower";
import { PoisonTower } from "../classes/towers/PoisonTower";
import Tower from "../classes/towers/Tower";
import { DebuffType } from "../types/types";

export const towerTypes = [
  "basic",
  "arrow",
  "cannon",
  "ice",
  "poison",
  "fire",
  "lightning",
  "mage",
] as const;

export type TowerType = (typeof towerTypes)[number];

export const prices: Record<TowerType, number> = {
  basic: 50,
  arrow: 100,
  cannon: 200,
  fire: 1000,
  ice: 450,
  mage: 7500,
  lightning: 2000,
  poison: 750,
} as const;

export type TowerStats = {
  range: number;
  damage: number;
  attackSpeed: number;
  splash: number;
  debuff: DebuffType | null;
  debuffDuration?: number;
  special?: string;
};

export const towerStats: Record<TowerType, TowerStats> = {
  basic: {
    range: 4,
    damage: 60,
    attackSpeed: 0.5,
    splash: 0,
    debuff: null,
  },
  arrow: {
    range: 5,
    damage: 50,
    attackSpeed: 1,
    splash: 0,
    debuff: null,
  },
  cannon: {
    range: 5,
    damage: 125,
    attackSpeed: 0.5,
    splash: 1.5,
    debuff: null,
  },
  fire: {
    range: 5,
    damage: 500,
    attackSpeed: 1,
    splash: 0.75,
    debuff: null,
  },
  ice: {
    range: 5,
    damage: 50,
    attackSpeed: 1,
    splash: 1,
    debuff: "freeze",
    debuffDuration: 2,
    special: "Slows enemies by 50%. Can stack to apply 66.7% slow",
  },
  mage: {
    range: 10,
    damage: 5000,
    attackSpeed: 2.5,
    splash: 0,
    debuff: null,
  },
  lightning: {
    range: 5,
    damage: 125,
    attackSpeed: 1,
    splash: 0,
    debuff: null,
    special: "Chains to nearby enemies",
  },
  poison: {
    range: 2,
    damage: 0,
    attackSpeed: 1,
    splash: 0,
    debuff: "poison",
    debuffDuration: 10,
    special: "Poison deals 0.5% of the target's max health per second",
  },
} as const;

export const TowerClasses: Record<TowerType, typeof Tower> = {
  basic: Tower,
  arrow: ArrowTower,
  cannon: CannonTower,
  mage: MageTower,
  ice: IceTower,
  fire: FireTower,
  lightning: LightningTower,
  poison: PoisonTower,
};
