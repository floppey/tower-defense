import { Buff } from "../../constants/buffs";
import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { SupportTower } from "./SupportTower";

export class SupportTowerRange extends SupportTower {
  buffsToApply: Buff[] = [
    {
      origin: this.id,
      type: "range",
      value: 0.5, // additively stacks with other range buffs
      stackable: true,
    },
  ];
  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "support-range");
  }

  attack() {}
}
