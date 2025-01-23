import { TowerType } from "../../types/types";
import { Bullet } from "../projectiles/Bullet";
import Tower from "./Tower";

export class CannonTower extends Tower {
  range: number = 5;
  damage: number = 125;
  attackSpeed: number = 0.75;
  type: TowerType = "cannon";

  attack() {
    const currentTime = Date.now();
    const timeSinceLastAttack = currentTime - this.lastAttackTime;

    if (timeSinceLastAttack > 1000 / this.attackSpeed) {
      const target = this.getTargetsInRange();
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
