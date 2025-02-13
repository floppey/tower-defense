import { Coordinates } from "../../types/types";
import { Entity } from "../Entity";
import { Game } from "../Game";

interface ButtonOptions {
  game: Game;
  position: Coordinates;
  width: number;
  height: number;
  text: string;
  onClick: () => void;
}

export class Button extends Entity {
  game: Game;
  #position: Coordinates;
  #width: number;
  #height: number;
  #text: string;
  #onClick: () => void;

  constructor({ game, position, width, height, text, onClick }: ButtonOptions) {
    super();
    this.game = game;
    this.#position = position;
    this.#width = width;
    this.#height = height;
    this.#text = text;
    this.#onClick = onClick;
  }

  draw() {
    const { ctx } = this.game;
    ctx.fillStyle = "#fff";
    ctx.fillRect(this.#position.x, this.#position.y, this.#width, this.#height);
    ctx.fillStyle = "green";
    ctx.fillRect(
      this.#position.x + 2,
      this.#position.y + 2,
      this.#width - 4,
      this.#height - 4
    );

    ctx.fillStyle = "#000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      this.#text,
      this.#position.x + this.#width / 2,
      this.#position.y + this.#height / 2
    );
  }

  isClicked(mouseCoordinates: Coordinates): boolean {
    return (
      mouseCoordinates.x >= this.#position.x &&
      mouseCoordinates.x <= this.#position.x + this.#width &&
      mouseCoordinates.y >= this.#position.y &&
      mouseCoordinates.y <= this.#position.y + this.#height
    );
  }

  handleClick(mouseCoordinates: Coordinates): boolean {
    if (this.isClicked(mouseCoordinates)) {
      this.#onClick();
      return true;
    }
    return false;
  }
}
