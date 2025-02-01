import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { Arrow } from "../projectiles/Arrow";
import Tower from "./Tower";

export class ArrowTower extends Tower {
  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "arrow");
  }

  attack() {
    const currentTime = Date.now();

    if (this.canAttack()) {
      const target = this.getTargetInRange();
      if (target) {
        this.game.projectiles.push(
          new Arrow({
            game: this.game,
            target,
            position: this.game.convertGridPositionToCoordinates(
              this.gridPosition
            ),
            damage: this.damage,
            speed: this.game.gameSpeed / 2,
            debuffs: this.debuffs,
            splash: this.splash,
            tower: this,
          })
        );
        this.lastAttackTime = currentTime;
      }
    }
  }
}
