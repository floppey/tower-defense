import { Coordinates } from "../../types/types";
import { Entity } from "../Entity";
import { Game } from "../Game";
import { Button } from "./Button";

interface DialogOptions {
  game: Game;
  position: Coordinates;
  width: number;
  height: number;
  texts: string[];
  buttons: Button[] | null;
}

export class Dialog extends Entity {
  game: Game;
  #position: Coordinates;
  #width: number;
  #height: number;
  #texts: string[];
  buttons: Button[] | null;

  constructor({
    game,
    position,
    width,
    height,
    texts,
    buttons,
  }: DialogOptions) {
    super();
    this.game = game;
    this.#position = position;
    this.#width = width;
    this.#height = height;
    this.#texts = texts;
    this.buttons = buttons;
  }

  draw() {
    const { ctx } = this.game;
    ctx.fillStyle = "#000";
    ctx.fillRect(this.#position.x, this.#position.y, this.#width, this.#height);

    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let y = this.#position.y + 20;
    this.#texts.forEach((text) => {
      ctx.fillText(text, this.#position.x + this.#width / 2, y);
      y += 20;
    });
    this.buttons?.forEach((button) => button.draw());
  }
}
