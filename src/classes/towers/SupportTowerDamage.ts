import { Buff } from "../../constants/buffs";
import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { SupportTower } from "./SupportTower";

export class SupportTowerDamage extends SupportTower {
  buffsToApply: Buff[] = [
    {
      origin: this.id,
      type: "damage",
      value: 1.5, // Damage Multiplier
      stackable: true,
    },
  ];
  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "support-damage");
  }

  attack() {}
}
