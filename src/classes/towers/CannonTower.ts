import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { Bullet } from "../projectiles/Bullet";
import Tower from "./Tower";

export class CannonTower extends Tower {
  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "cannon");
  }

  attack() {
    const currentTime = Date.now();

    if (this.canAttack()) {
      const target = this.getTargetInRange();
      if (target?.gridPosition) {
        this.game.projectiles.push(
          new Bullet({
            game: this.game,
            target: target.gridPosition,
            position: this.game.convertGridPositionToCoordinates(
              this.gridPosition
            ),
            damage: this.damage,
            speed: this.game.gameSpeed / 10,
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
