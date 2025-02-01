import { ImageName } from "../../constants/images";
import { Projectile } from "./Projectile";

export class Fireball extends Projectile {
  height: number = 10;
  width: number = 25;

  images: ImageName[] = ["fire-1", "fire-2"];

  impact() {
    if (Math.random() > 0.8) {
      const numberOfSeconds = 4;
      this.damage *= 2;

      this.debuffs = [
        {
          type: "burn",
          duration: this.game.gameSpeed * numberOfSeconds,
          data: { damage: this.damage / numberOfSeconds },
        },
      ];
    }
    super.impact();
  }
}
