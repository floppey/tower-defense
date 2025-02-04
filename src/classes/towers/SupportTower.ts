import { Buff } from "../../constants/buffs";
import { getDistanceBetweenGridPositions } from "../../util/getDistanceBetweenGridPositions";
import Tower from "./Tower";

export class SupportTower extends Tower {
  buffInterval = 5000;
  lastBuffTime = Date.now() - this.buffInterval;
  buffsToApply: Buff[] = [];

  attack() {}

  update(): void {
    super.update();

    if (Date.now() > this.lastBuffTime + this.buffInterval) {
      this.buffTowers();
      this.lastBuffTime = Date.now();
    }
  }

  buffTowers() {
    const towersInRange = this.getTowersInRange();
    towersInRange.forEach((tower) => {
      this.buffsToApply.forEach((buff) => {
        if (
          tower.towerBuffs.some(
            (tb) => tb.type === buff.type && tb.origin === this.id
          )
        ) {
          return;
        }
        tower.addBuff(buff);
      });
    });
  }

  onSell(): void {
    super.onSell();
    this.removeBuffs();
  }

  removeBuffs() {
    const towersInRange = this.getTowersInRange();
    towersInRange.forEach((tower) => {
      this.buffsToApply.forEach((buff) => {
        tower.removeBuff(buff);
      });
    });
  }

  getTowersInRange() {
    return this.game.level.towers.filter((tower) => {
      if (this.id === tower.id) {
        return false;
      }
      const distance = getDistanceBetweenGridPositions(
        this.gridPosition,
        tower.gridPosition
      );
      return distance <= this.range + 0.5;
    });
  }
}
