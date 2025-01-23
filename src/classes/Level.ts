import { GridPosition } from "../types/types";
import { Entity } from "./Entity";
import { Game } from "./Game";
import { MapMatrix } from "./MapMatrix";
import Monster from "./Monster";
import Tower from "./towers/Tower";

export class Level extends Entity {
  game: Game;
  startPositions: GridPosition[];
  endPositions: GridPosition[];
  mapMatrix: MapMatrix;
  minLength: number;
  maxLength: number;
  maxRepeatSquares: number;
  towers: Tower[] = [];
  monsters: Monster[] = [];

  constructor(
    game: Game,
    startPositions: GridPosition[],
    endPositions: GridPosition[],
    minLength: number,
    maxLength: number,
    maxRepeatSquares: number
  ) {
    super();
    this.game = game;
    this.startPositions = startPositions;
    this.endPositions = endPositions;
    this.minLength = minLength;
    this.maxLength = maxLength;
    this.maxRepeatSquares = maxRepeatSquares;
    this.mapMatrix = new MapMatrix(this);
  }
}
