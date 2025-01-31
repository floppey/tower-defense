import { ImageName } from "../../constants/images";
import { Coordinates, GridPosition } from "../../types/types";
import { Game } from "../Game";
import Monster from "../monsters/Monster";
import { Projectile } from "./Projectile";

export class Crystal extends Projectile {
  height: number = 12;
  width: number = 20;

  images: ImageName[] = ["crystal"];

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
