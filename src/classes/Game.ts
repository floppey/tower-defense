import {
  END_CELL,
  START_CELL,
  UNSET_CELL,
} from "../constants/mapMatrixConstants";
import { MouseHandler } from "../input/MouseHandler";
import { GridPosition } from "../types/types";
import { initUi } from "../ui/initUi";
import { updateHealth } from "../ui/updateHealth";
import { updateKillCount } from "../ui/updateKillCount";
import { updateMoney } from "../ui/updateMoney";
import { updateMonsterCount } from "../ui/updateMonsterCount";
import { Level } from "./Level";
import Monster from "./Monster";

export class Game {
  #health: number = 10;
  #money: number = 100;
  #killCount = 0;
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
  tempCounter = -1;

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

    document.body.appendChild(this.canvas);
    this.mouseHandler = new MouseHandler(this);
    this.loadImages();
    // if debug query param is present, enable debug mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("debug")) {
      this.debug = true;
    }
    initUi(this);
  }

  getNumberOfMonstersPerWave() {
    return 20 + (this.level.wave - 1) * 2;
  }

  startWave() {
    if (
      this.tempCounter < this.getNumberOfMonstersPerWave() &&
      this.tempCounter !== -1
    ) {
      return;
    }
    this.level.wave++;
    this.tempCounter = 0;
    this.spawnMonsters();
  }

  spawnMonsters() {
    setTimeout(() => {
      if (this.tempCounter < this.getNumberOfMonstersPerWave()) {
        this.spawnMonster();
        this.tempCounter++;
        this.spawnMonsters();
      }
    }, 500);
  }

  spawnMonster() {
    let health = 100;
    if (this.level.wave > 3) {
      health = 100 + (this.level.wave - 3) * 15;
    }
    let speed = 1;
    if (this.level.wave > 5) {
      speed = 1 + (this.level.wave - 5) * 0.2;
    }
    this.level.monsters.push(
      new Monster({
        game: this,
        health,
        speed,
        damage: 1,
      })
    );
    updateMonsterCount(this.level.monsters.length);
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

  update() {
    const monstersInEnd = this.level.monsters.filter(
      (monster) => monster.distance >= this.level.mapMatrix.totalDistance
    );
    const deadMonsters = this.level.monsters.filter(
      (monster) => !monster.isAlive()
    );
    deadMonsters.forEach((monster) => {
      this.money += monster.reward;
      this.killCount++;
    });
    this.level.monsters = this.level.monsters.filter((monster) => {
      return (
        monster.isAlive() &&
        monster.distance < this.level.mapMatrix.totalDistance
      );
    });
    monstersInEnd.forEach((monster) => {
      console.log(`Monster reached the end, -${monster.damage} health`);
      this.health -= monster.damage;
    });
    this.level.monsters.forEach((monster) => {
      monster.move();
    });
    this.level.towers.forEach((tower) => {
      tower.update();
    });
    if (this.#health < 0) {
      if (confirm("Game Over! Play again?")) {
        window.location.reload();
      }
    }
    if (deadMonsters.length > 0 || monstersInEnd.length > 0) {
      updateMonsterCount(this.level.monsters.length);
    }
  }

  render() {
    this.drawGrid();
    this.level.monsters.forEach((monster) => {
      monster.render();
    });
    this.level.towers.forEach((tower) => {
      tower.render();
    });
  }

  drawGrid(): void {
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

  get health(): number {
    return this.#health;
  }
  set health(value: number) {
    this.#health = value;
    updateHealth(this.#health);
  }

  get money(): number {
    return this.#money;
  }
  set money(value: number) {
    this.#money = value;
    updateMoney(this.#money);
  }

  get killCount(): number {
    return this.#killCount;
  }
  set killCount(value: number) {
    this.#killCount = value;
    updateKillCount(this.#killCount);
  }
}
