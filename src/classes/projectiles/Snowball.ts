import { debuffs } from "../../constants/debuffs";
import { Coordinates } from "../../types/types";
import { Game } from "../Game";
import Monster from "../Monster";
import { Projectile } from "./Projectile";

export class Snowball extends Projectile {
  height: number = 25;
  width: number = 25;
  splash = 1;
  images = [
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
  debuffs = [{ type: debuffs.freeze, duration: 2000 }];

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
      speed: 333,
      damage,
      target,
      position,
    });
  }
}
