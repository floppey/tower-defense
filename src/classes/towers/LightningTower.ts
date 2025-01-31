import { TowerType } from "../../types/types";
import { lightning } from "../projectiles/Lightning";
import Tower from "./Tower";

export class LightningTower extends Tower {
  range: number = 5;
  damage: number = 125;
  attackSpeed: number = 1;
  type: TowerType = "lightning";

  attack() {
    const currentTime = Date.now();

    if (this.canAttack()) {
      const target = this.getTargetInRange();
      if (target?.gridPosition) {
        this.game.projectiles.push(
          new lightning({
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
