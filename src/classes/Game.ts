import {
  END_CELL,
  START_CELL,
  UNSET_CELL,
} from "../constants/mapMatrixConstants";
import { MouseHandler } from "../input/MouseHandler";
import { GridPosition } from "../types/types";
import { Level } from "./Level";
import Monster from "./Monster";

export class Game {
  debug: boolean = false;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  squareSize = 50; // Size of each square in the grid
  gridWidth = 25; // Number of squares in the grid width
  gridHeight = 25; // Number of squares in the grid height
  level: Level;
  mouseHandler: MouseHandler;
  hoveredCell: GridPosition | null = null;
  images: Record<string, HTMLImageElement> = {};
  tempCounter = 0;

  constructor() {
    this.canvas = document.createElement("canvas");
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("2d context not supported");
    }
    this.canvas.width = this.squareSize * this.gridWidth;
    this.canvas.height = this.squareSize * this.gridHeight;
    this.ctx = ctx;
    this.level = new Level(
      this,
      [
        {
          col: 0,
          row: 0,
        },
      ],
      [
        {
          col: 20,
          row: 20,
        },
      ],
      75,
      150,
      2
    );

    this.spawnMonsters();
    document.body.appendChild(this.canvas);
    this.mouseHandler = new MouseHandler(this);
    this.loadImages();
    // if debug query param is present, enable debug mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("debug")) {
      this.debug = true;
    }
  }

  spawnMonsters() {
    setTimeout(() => {
      if (this.tempCounter < 25) {
        this.spawnMonster();
        this.tempCounter++;
        this.spawnMonsters();
      }
    }, 500);
  }

  spawnMonster() {
    this.level.monsters.push(new Monster(this, 100, 1, 10));
  }

  loadImages() {
    const imageNames = [
      "tower-basic",
      "tower-arrow",
      "tower-cannon",
      "tower-mage",
      "tower-ice",
      "tower-fire",
    ];
    imageNames.forEach((name) => {
      const img = new Image();
      img.src = `./assets/${name}.png`;
      this.images[name] = img;
    });
  }

  public update() {
    const monstersInEnd = this.level.monsters.filter(
      (monster) => monster.distance >= this.level.mapMatrix.totalDistance
    );
    this.level.monsters = this.level.monsters.filter((monster) => {
      return (
        monster.isAlive() &&
        monster.distance < this.level.mapMatrix.totalDistance
      );
    });
    monstersInEnd.forEach((monster) => {
      console.log("Monster reached the end");
    });
    this.level.monsters.forEach((monster) => {
      monster.move();
    });
    this.level.towers.forEach((tower) => {
      tower.update();
    });
  }

  public render() {
    this.drawGrid();
    this.level.monsters.forEach((monster) => {
      monster.render();
    });
    this.level.towers.forEach((tower) => {
      tower.render();
    });
  }

  public drawGrid(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const { matrix } = this.level.mapMatrix;

    Object.keys(matrix).forEach((xKey) => {
      const x = Number(xKey);
      Object.keys(matrix[x]).forEach((yKey) => {
        const y = Number(yKey);
        const cell = matrix[x][y];

        this.ctx.save();

        if (typeof cell === "string") {
          if (cell === START_CELL) {
            this.ctx.fillStyle = "blue";
          } else if (cell === END_CELL) {
            this.ctx.fillStyle = "red";
          } else if (cell === UNSET_CELL) {
            this.ctx.fillStyle = "green";
          } else {
            this.ctx.fillStyle = "green";
          }
        } else if (Array.isArray(cell) && cell.length > 0) {
          this.ctx.fillStyle = "rgb(200, 200, 200)";
        }
        this.ctx.fillRect(
          x * this.squareSize,
          y * this.squareSize,
          this.squareSize,
          this.squareSize
        );
        if (this.debug && Array.isArray(cell) && cell.length > 0) {
          this.ctx.fillStyle = "black";
          this.ctx.font = "12px Arial";
          this.ctx.fillText(
            cell.toString(),
            x * this.squareSize + 5,
            y * this.squareSize + 15
          );
        }
        this.ctx.strokeStyle = "lightgray";
        this.ctx.strokeRect(
          x * this.squareSize,
          y * this.squareSize,
          this.squareSize,
          this.squareSize
        );

        this.ctx.restore();
      });
    });
    if (this.hoveredCell) {
      this.ctx.save();
      // Draw a thick gold border around the hovered cell
      this.ctx.strokeStyle = "gold";
      this.ctx.lineWidth = 3;

      this.ctx.strokeRect(
        this.hoveredCell.col * this.squareSize,
        this.hoveredCell.row * this.squareSize,
        this.squareSize,
        this.squareSize
      );
      this.ctx.restore();
    }
  }
}
