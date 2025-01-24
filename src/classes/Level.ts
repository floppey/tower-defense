import { GridPosition, Map } from "../types/types";
import { updateWaveCount } from "../ui/updateWaveCount";
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
  #wave: number = 0;

  constructor({
    game,
    startPositions,
    endPositions,
    minLength,
    maxLength,
    maxRepeatSquares,
    map,
  }: {
    game: Game;
    startPositions: GridPosition[];
    endPositions: GridPosition[];
    minLength: number;
    maxLength: number;
    maxRepeatSquares: number;
    map?: Map;
  }) {
    super();
    this.game = game;
    this.startPositions = startPositions;
    this.endPositions = endPositions;
    this.minLength = minLength;
    this.maxLength = maxLength;
    this.maxRepeatSquares = maxRepeatSquares;
    this.mapMatrix = new MapMatrix(this, map);
  }

  get wave() {
    return this.#wave;
  }
  set wave(value: number) {
    this.#wave = value;
    updateWaveCount(this.#wave);
  }
}
