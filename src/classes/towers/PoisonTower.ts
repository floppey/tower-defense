import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { Poison } from "../projectiles/Poison";
import Tower from "./Tower";

export class PoisonTower extends Tower {
  multiTarget = true;

  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "poison");
  }

  attack() {
    const currentTime = Date.now();

    if (this.canAttack()) {
      const targets = this.getTargetsInRange();
      targets.forEach((target) => {
        if (target?.gridPosition) {
          this.game.projectiles.push(
            new Poison({
              game: this.game,
              target: target,
              position: this.game.convertGridPositionToCoordinates(
                this.gridPosition
              ),
              damage: this.damage,
              debuffs: this.debuffs,
              splash: this.splash,
              speed: this.game.gameSpeed / 5,
            })
          );
          this.lastAttackTime = currentTime;
        }
      });
    }
  }
}
