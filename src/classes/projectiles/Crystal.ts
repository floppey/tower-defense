import { ImageName } from "../../constants/images";
import { Projectile } from "./Projectile";

export class Crystal extends Projectile {
  height: number = 12;
  width: number = 20;

  images: ImageName[] = ["crystal"];
}
