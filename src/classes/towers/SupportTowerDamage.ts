import { Buff } from "../../constants/buffs";
import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { SupportTower } from "./SupportTower";

export class SupportTowerDamage extends SupportTower {
  buffsToApply: Buff[] = [
    {
      origin: this.id,
      type: "damage",
      value: 0.5, // additively stacks with other damage buffs
      stackable: true,
    },
  ];
  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "support-damage");
  }

  attack() {}
}
