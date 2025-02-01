import { ImageName } from "../../constants/images";
import { GridPosition } from "../../types/types";
import { Projectile, ProjectileProps } from "./Projectile";

interface BulletProps extends ProjectileProps {
  target: GridPosition;
}
export class Bullet extends Projectile {
  height: number = 10;
  width: number = 25;
  images: ImageName[] = ["bullet-1", "bullet-2", "bullet-3", "bullet-4"];

  constructor(props: BulletProps) {
    super(props);
  }
}
