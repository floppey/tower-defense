import { Coordinates, GridPosition } from "../../types/types";
import { Game } from "../Game";
import Monster from "../Monster";
import { Projectile } from "./Projectile";

export class Crystal extends Projectile {
  height: number = 20;
  width: number = 40;

  images = ["magic"];

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
      speed: 800,
      damage,
      target,
      position,
    });
  }
}
