import { TowerType } from "../../types/types";
import { Bullet } from "../projectiles/Bullet";
import { Fireball } from "../projectiles/Fireball";
import Tower from "./Tower";

export class FireTower extends Tower {
  range: number = 5;
  damage: number = 500;
  attackSpeed: number = 2.5;
  type: TowerType = "fire";

  attack() {
    const currentTime = Date.now();

    if (this.canAttack()) {
      const target = this.getTargetsInRange();
      if (target?.gridPosition) {
        this.game.projectiles.push(
          new Fireball({
            game: this.game,
            target: target,
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
