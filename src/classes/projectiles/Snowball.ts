import { debuffValues } from "../../constants/debuffs";
import { ImageName } from "../../constants/images";
import { Projectile } from "./Projectile";

export class Snowball extends Projectile {
  height: number = 25;
  width: number = 25;
  images: ImageName[] = [
    "frost-1",
    "frost-2",
    "frost-3",
    "frost-4",
    "frost-5",
    "frost-6",
    "frost-7",
    "frost-8",
    "frost-9",
    "frost-10",
    "frost-11",
    "frost-12",
    "frost-13",
  ];
  debuffs = [{ type: debuffValues.freeze, duration: this.game.gameSpeed * 2 }];
}
