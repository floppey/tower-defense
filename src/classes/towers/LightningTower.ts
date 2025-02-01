import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { Lightning } from "../projectiles/Lightning";
import Tower from "./Tower";

export class LightningTower extends Tower {
  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "lightning");
  }

  attack() {
    const currentTime = Date.now();

    if (this.canAttack()) {
      const target = this.getTargetInRange();
      if (target?.gridPosition) {
        this.game.projectiles.push(
          new Lightning({
            game: this.game,
            target: target,
            position: this.game.convertGridPositionToCoordinates(
              this.gridPosition
            ),
            damage: this.damage,
            debuffs: this.debuffs,
            splash: this.splash,
            speed: this.game.gameSpeed * 1.5,
            tower: this,
          })
        );
        this.lastAttackTime = currentTime;
      }
    }
  }
}
