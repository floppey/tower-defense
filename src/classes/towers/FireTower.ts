import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { Fireball } from "../projectiles/Fireball";
import Tower from "./Tower";

export class FireTower extends Tower {
  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "fire");
  }

  attack() {
    const currentTime = Date.now();

    if (this.canAttack()) {
      const target = this.getTargetInRange();
      if (target?.gridPosition) {
        this.game.projectiles.push(
          new Fireball({
            game: this.game,
            target: target,
            position: this.game.convertGridPositionToCoordinates(
              this.gridPosition
            ),
            damage: this.damage,
            speed: this.game.gameSpeed / 2,
            debuffs: this.debuffs,
            splash: this.splash,
          })
        );
        this.lastAttackTime = currentTime;
      }
    }
  }
}
