import { ImageName } from "../../constants/images";
import { getDistanceBetweenCoordinates } from "../../util/getDistanceBetweenCoordinates";
import Monster from "../monsters/Monster";
import { Projectile, ProjectileProps } from "./Projectile";

interface LightningProps extends ProjectileProps {
  target: Monster;
}

export class Lightning extends Projectile {
  height: number = 15;
  width: number = 30;
  previousTargets: number[] = [];
  images: ImageName[] = ["lightning-1", "lightning-2"];

  constructor(props: LightningProps) {
    super(props);
    this.previousTargets.push(props.target.id);
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
      if (distance < 150) {
        this.previousTargets.push(monster.id);
        this.target = monster;
        this.game.projectiles.push(this);
        return true;
      }
      return false;
    });
  }
}
