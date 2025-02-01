import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { Crystal } from "../projectiles/Crystal";
import Tower from "./Tower";

export class MageTower extends Tower {
  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "mage");
  }

  attack() {
    const currentTime = Date.now();

    if (this.canAttack()) {
      const target = this.getTargetInRange();
      if (target?.gridPosition) {
        this.game.projectiles.push(
          new Crystal({
            game: this.game,
            target: target,
            position: this.game.convertGridPositionToCoordinates(
              this.gridPosition
            ),
            damage: this.damage,
            debuffs: this.debuffs,
            splash: this.splash,
            speed: this.game.gameSpeed,
            tower: this,
          })
        );
        this.lastAttackTime = currentTime;
      }
    }
  }
}
