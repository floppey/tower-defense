import { TowerType } from "../../types/types";
import { Bullet } from "../projectiles/Bullet";
import Tower from "./Tower";

export class CannonTower extends Tower {
  range: number = 5;
  damage: number = 125;
  attackSpeed: number = 0.5;
  type: TowerType = "cannon";

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
          })
        );
        this.lastAttackTime = currentTime;
      }
    }
  }
}
