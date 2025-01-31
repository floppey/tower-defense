import { ImageName } from "../../constants/images";
import { Coordinates } from "../../types/types";
import { getDistanceBetweenCoordinates } from "../../util/getDistanceBetweenCoordinates";
import { Game } from "../Game";
import Monster from "../monsters/Monster";
import { Projectile } from "./Projectile";

export class lightning extends Projectile {
  height: number = 15;
  width: number = 30;
  previousTargets: number[] = [];
  images: ImageName[] = ["lightning-1", "lightning-2"];

  constructor({
    game,
    target,
    position,
    damage,
  }: {
    game: Game;
    target: Monster;
    position: Coordinates;
    damage: number;
  }) {
    super({
      game,
      speed: game.gameSpeed * 1.5,
      damage,
      target,
      position,
    });
    this.previousTargets.push(target.id);
  }

  impact() {
    super.impact();
    this.game.level.monsters.find((monster) => {
      if (this.target instanceof Monster === false) {
        return false;
      }
      if (this.previousTargets.includes(monster.id)) {
        return false;
      }
      const distance = getDistanceBetweenCoordinates(
        monster.getCanvasPosition()!,
        this.target.getCanvasPosition()!
      );
      if (distance < 100) {
        this.previousTargets.push(monster.id);
        this.target = monster;
        this.game.projectiles.push(this);
        return true;
      }
      return false;
    });
  }
}
