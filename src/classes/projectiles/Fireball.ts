import { Coordinates, GridPosition } from "../../types/types";
import { Game } from "../Game";
import Monster from "../Monster";
import { Projectile } from "./Projectile";

export class Fireball extends Projectile {
  height: number = 10;
  width: number = 25;
  splash = 0.75;
  images = ["fire-1", "fire-2"];

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
      speed: game.gameSpeed / 2,
      damage,
      target,
      position,
    });
  }
}
