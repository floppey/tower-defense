import { ImageName } from "../../constants/images";
import { Projectile } from "./Projectile";

export class Fireball extends Projectile {
  height: number = 10;
  width: number = 25;

  images: ImageName[] = ["fire-1", "fire-2"];
}
