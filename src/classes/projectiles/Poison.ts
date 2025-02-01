import { ImageName } from "../../constants/images";
import { Projectile } from "./Projectile";

export class Poison extends Projectile {
  height: number = 25;
  width: number = 25;
  images: ImageName[] = [
    "poison-1",
    "poison-2",
    "poison-3",
    "poison-4",
    "poison-5",
    "poison-6",
    "poison-7",
    "poison-8",
  ];
}
