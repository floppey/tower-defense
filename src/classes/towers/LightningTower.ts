import { GridPosition } from "../../types/types";
import { Game } from "../Game";
import { Lightning } from "../projectiles/Lightning";
import Tower from "./Tower";

export class LightningTower extends Tower {
  Projectile = Lightning;

  constructor(game: Game, gridPosition: GridPosition) {
    super(game, gridPosition, "lightning");
    this.projectileSpeed = this.game.gameSpeed * 4;
  }

  getDamage() {
    let damage = this.damage;

    let damageMultiplier = 1;
    this.towerBuffs.forEach((buff) => {
      if (buff.type === "damage") {
        damageMultiplier += buff.value;
      }
    });
    damage *= damageMultiplier;

    while (Math.random() > 0.9) {
      damage *= 10;
    }
    return damage;
  }
}
