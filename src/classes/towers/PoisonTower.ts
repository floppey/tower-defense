import { TowerType } from "../../types/types";
import Monster from "../monsters/Monster";
import { Poison } from "../projectiles/Poison";
import Tower from "./Tower";

export class PoisonTower extends Tower {
  range: number = 2;
  damage: number = 0;
  attackSpeed: number = 1;
  type: TowerType = "poison";
  multiTarget = true;

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
            })
          );
          this.lastAttackTime = currentTime;
        }
      });
    }
  }
}
