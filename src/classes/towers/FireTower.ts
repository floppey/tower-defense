import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { Fireball } from "../projectiles/Fireball";
import Tower from "./Tower";

export class FireTower extends Tower {
  Projectile = Fireball;
  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "fire");
    this.projectileSpeed = this.game.gameSpeed / 2;
  }
}
