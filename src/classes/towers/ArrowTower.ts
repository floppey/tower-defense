import { TowerType } from "../../types/types";
import { Arrow } from "../projectiles/Arrow";
import Tower from "./Tower";

export class ArrowTower extends Tower {
  range: number = 5;
  damage: number = 50;
  attackSpeed: number = 1;
  type: TowerType = "arrow";

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
          })
        );
        this.lastAttackTime = currentTime;
      }
    }
  }
}
