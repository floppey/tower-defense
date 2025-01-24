import { debuffs } from "../../constants/debuffs";
import { Coordinates } from "../../types/types";
import { Game } from "../Game";
import Monster from "../Monster";
import { Projectile } from "./Projectile";

export class Poison extends Projectile {
  height: number = 25;
  width: number = 25;
  images = [
    "poison-1",
    "poison-2",
    "poison-3",
    "poison-4",
    "poison-5",
    "poison-6",
    "poison-7",
    "poison-8",
  ];
  debuffs = [{ type: debuffs.poison, duration: 10000 }];

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
      speed: 200,
      damage,
      target,
      position,
    });
  }
}
