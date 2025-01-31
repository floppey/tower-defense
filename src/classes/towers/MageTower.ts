import { TowerType } from "../../types/types";
import { Crystal } from "../projectiles/Crystal";
import Tower from "./Tower";

export class MageTower extends Tower {
  range: number = 10;
  damage: number = 2500;
  attackSpeed: number = 2.5;
  type: TowerType = "mage";

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
          })
        );
        this.lastAttackTime = currentTime;
      }
    }
  }
}
