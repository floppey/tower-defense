import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { Snowball } from "../projectiles/Snowball";
import Tower from "./Tower";

export class IceTower extends Tower {
  Projectile = Snowball;
  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "ice");
    this.projectileSpeed = this.game.gameSpeed / 2;
  }
}
