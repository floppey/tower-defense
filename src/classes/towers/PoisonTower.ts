import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { Poison } from "../projectiles/Poison";
import Tower from "./Tower";

export class PoisonTower extends Tower {
  Projectile = Poison;

  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "poison");
    this.projectileSpeed = this.game.gameSpeed / 5;
  }
}
