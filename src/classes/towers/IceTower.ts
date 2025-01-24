import { TowerType } from "../../types/types";
import { Snowball } from "../projectiles/Snowball";
import Tower from "./Tower";

export class IceTower extends Tower {
  range: number = 5;
  damage: number = 50;
  attackSpeed: number = 1.5;
  type: TowerType = "ice";

  attack() {
    const currentTime = Date.now();

    if (this.canAttack()) {
      const target = this.getTargetsInRange();
      if (target?.gridPosition) {
        this.game.projectiles.push(
          new Snowball({
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
