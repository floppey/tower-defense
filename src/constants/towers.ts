import { ArrowTower } from "../classes/towers/ArrowTower";
import { CannonTower } from "../classes/towers/CannonTower";
import { FireTower } from "../classes/towers/FireTower";
import { IceTower } from "../classes/towers/IceTower";
import { LightningTower } from "../classes/towers/LightningTower";
import { MageTower } from "../classes/towers/MageTower";
import { PoisonTower } from "../classes/towers/PoisonTower";
import { SupportTowerDamage } from "../classes/towers/SupportTowerDamage";
import { SupportTowerRange } from "../classes/towers/SupportTowerRange";
import Tower from "../classes/towers/Tower";
import { DebuffType } from "./debuffs";

export const towerTypes = [
  "basic",
  "arrow",
  "cannon",
  "ice",
  "poison",
  "fire",
  "lightning",
  "mage",
  "support-damage",
  "support-range",
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
  poison: 500,
  "support-damage": 5000,
  "support-range": 5000,
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
    damage: 150,
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
    special:
      "20% chance to crit. Critical hits deal double damage and applies a potentially infinitely scaling burn debuff",
  },
  ice: {
    range: 5,
    damage: 50,
    attackSpeed: 1,
    splash: 1,
    debuff: "freeze",
    debuffDuration: 2,
    special: "Slows enemies by 50%. Can stack two times.",
  },
  mage: {
    range: 10,
    damage: 5000,
    attackSpeed: 3,
    splash: 0,
    debuff: null,
  },
  lightning: {
    range: 5,
    damage: 125,
    attackSpeed: 1,
    splash: 0,
    debuff: null,
    special:
      "Deals random damage. With a good deal of luck it can oneshot any monster. Lightning also chains to nearby enemies",
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
  "support-damage": {
    range: 2,
    damage: 0,
    attackSpeed: 0,
    splash: 0,
    debuff: null,
    special: "Increases damage of nearby towers by 50%",
  },
  "support-range": {
    range: 2,
    damage: 0,
    attackSpeed: 0,
    splash: 0,
    debuff: null,
    special: "Increases range of nearby towers by 50%",
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
  "support-damage": SupportTowerDamage,
  "support-range": SupportTowerRange,
};
