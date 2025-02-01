import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { Snowball } from "../projectiles/Snowball";
import Tower from "./Tower";

export class IceTower extends Tower {
  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "ice");
  }

  attack() {
    const currentTime = Date.now();

    if (this.canAttack()) {
      const target = this.getTargetInRange();
      if (target?.gridPosition) {
        this.game.projectiles.push(
          new Snowball({
            game: this.game,
            target: target,
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
