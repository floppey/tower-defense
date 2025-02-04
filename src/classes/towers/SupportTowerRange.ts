import { Buff } from "../../constants/buffs";
import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { SupportTower } from "./SupportTower";

export class SupportTowerRange extends SupportTower {
  buffsToApply: Buff[] = [
    {
      origin: this.id,
      type: "range",
      value: 2, // Range Multiplier
      stackable: true,
    },
  ];
  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "support-range");
  }

  attack() {}
}
