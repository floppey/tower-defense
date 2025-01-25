import { Coordinates, GridPosition } from "../../types/types";
import { Game } from "../Game";
import { Projectile } from "./Projectile";

export class Bullet extends Projectile {
  height: number = 10;
  width: number = 25;
  splash = 1.5;
  images = ["bullet-1", "bullet-2", "bullet-3", "bullet-4"];

  constructor({
    game,
    target,
    position,
    damage,
  }: {
    game: Game;
    target: GridPosition;
    position: Coordinates;
    damage: number;
  }) {
    super({
      game,
      speed: game.gameSpeed / 10,
      damage,
      target,
      position,
    });
  }
}
