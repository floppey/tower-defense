import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { Arrow } from "../projectiles/Arrow";
import Tower from "./Tower";

export class ArrowTower extends Tower {
  Projectile = Arrow;
  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "arrow");
    this.projectileSpeed = this.game.gameSpeed;
  }
}
