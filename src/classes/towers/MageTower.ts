import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { Crystal } from "../projectiles/Crystal";
import Tower from "./Tower";

export class MageTower extends Tower {
  Projectile = Crystal;

  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "mage");
    this.projectileSpeed = this.game.gameSpeed * 2;
  }
}
