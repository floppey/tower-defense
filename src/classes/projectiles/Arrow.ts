import { Coordinates } from "../../types/types";
import { Game } from "../Game";
import Monster from "../monsters/Monster";
import { Projectile } from "./Projectile";

export class Arrow extends Projectile {
  height: number = 10;
  width: number = 25;

  constructor({
    game,
    target,
    position,
    damage,
    speed,
  }: {
    game: Game;
    target: Monster;
    position: Coordinates;
    damage: number;
    speed: number;
  }) {
    super({
      game,
      speed,
      damage,
      target,
      position,
    });
  }
}
