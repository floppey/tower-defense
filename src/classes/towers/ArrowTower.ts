import { TowerType } from "../../types/types";
import { Arrow } from "../projectiles/Arrow";
import Tower from "./Tower";

export class ArrowTower extends Tower {
  range: number = 5;
  damage: number = 25;
  attackSpeed: number = 2;
  type: TowerType = "arrow";

  attack() {
    const currentTime = Date.now();
    const timeSinceLastAttack = currentTime - this.lastAttackTime;

    if (timeSinceLastAttack > 1000 / this.attackSpeed) {
      const target = this.getTargetsInRange();
      if (target) {
        this.game.projectiles.push(
          new Arrow({
            game: this.game,
            target,
            position: this.game.convertGridPositionToCoordinates(
              this.gridPosition
            ),
            damage: this.damage,
            speed: 500,
          })
        );
        this.lastAttackTime = currentTime;
      }
    }
  }
}
