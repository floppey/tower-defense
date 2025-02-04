import { GridPosition } from "../../types/types";
import { getMonsterHealth } from "../../util/getMonsterHealth";
import { Game } from "../Game";
import { Lightning } from "../projectiles/Lightning";
import Tower from "./Tower";

export class LightningTower extends Tower {
  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "lightning");
  }

  attack() {
    const currentTime = Date.now();

    if (this.canAttack()) {
      const target = this.getTargetInRange();
      if (target?.gridPosition) {
        const monsterHealth = getMonsterHealth(this.game.level.wave);
        let damage = monsterHealth / 10000;

        let damageMultiplier = 1;
        this.towerBuffs.forEach((buff) => {
          if (buff.type === "damage") {
            damageMultiplier *= buff.value;
          }
        });
        damage *= damageMultiplier;

        while (Math.random() > 0.9) {
          damage *= 10;
        }

        console.log("Lightning Tower Damage: ", damage);

        this.game.projectiles.push(
          new Lightning({
            game: this.game,
            target: target,
            position: this.game.convertGridPositionToCoordinates(
              this.gridPosition
            ),
            damage: damage,
            debuffs: this.debuffs,
            splash: this.splash,
            speed: this.game.gameSpeed * 1.5,
            tower: this,
          })
        );
        this.lastAttackTime = currentTime;
      }
    }
  }
}
