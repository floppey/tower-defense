import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { Bullet } from "../projectiles/Bullet";
import Tower from "./Tower";

export class CannonTower extends Tower {
  Projectile = Bullet;
  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "cannon");
    this.projectileSpeed = this.game.gameSpeed / 2;
  }
}
