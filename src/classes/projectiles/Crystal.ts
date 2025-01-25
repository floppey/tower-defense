import { Coordinates, GridPosition } from "../../types/types";
import { Game } from "../Game";
import Monster from "../Monster";
import { Projectile } from "./Projectile";

export class Crystal extends Projectile {
  height: number = 15;
  width: number = 30;

  images = ["crystal"];

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
      speed: (game.gameSpeed / 10) * 8,
      damage,
      target,
      position,
    });
  }
}
