import {
  END_CELL,
  START_CELL,
  UNSET_CELL,
} from "../constants/mapMatrixConstants";
import { TowerClasses } from "../constants/towers";
import { MouseHandler } from "../input/MouseHandler";
import { spiralMap } from "../maps/spiralMap";
import { Coordinates, GridPosition, TowerType } from "../types/types";
import { initUi } from "../ui/initUi";
import { updateHealth } from "../ui/updateHealth";
import { updateKillCount } from "../ui/updateKillCount";
import { updateMoney } from "../ui/updateMoney";
import { updateMonsterCount } from "../ui/updateMonsterCount";
import { Level } from "./Level";
import Monster from "./Monster";
import { Projectile } from "./projectiles/Projectile";
import Tower from "./towers/Tower";

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
  projectiles: Projectile[] = [];
  #newTower: Tower | null = null;
  #paused = false;
  gameSpeed = 1000;

  constructor() {
    this.canvas = document.createElement("canvas");
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("2d context not supported");
    }
    this.ctx = ctx;
    if (Math.random() > 0.5) {
      this.gridHeight = 20;
      this.gridWidth = 20;
      this.level = new Level({
        game: this,
        endPositions: [
          {
            col: 8,
            row: 10,
          },
        ],
        startPositions: [
          {
            col: 0,
            row: 1,
          },
        ],
        maxLength: 200,
        maxRepeatSquares: 1,
        minLength: 100,
        map: spiralMap,
      });
    } else {
      this.level = new Level({
        game: this,
        endPositions: [
          {
            col: Math.floor((Math.random() * this.gridHeight) / 2),
            row: Math.floor((Math.random() * this.gridWidth) / 2),
          },
        ],
        startPositions: [
          {
            col: Math.floor(((Math.random() + 0.5) * this.gridHeight) / 2),
            row: Math.floor(((Math.random() + 0.5) * this.gridWidth) / 2),
          },
        ],
        maxLength: 250,
        maxRepeatSquares: 3,
        minLength: 100,
      });
    }
    this.canvas.width = this.squareSize * this.gridWidth;
    this.canvas.height = this.squareSize * this.gridHeight;

    document.body.appendChild(this.canvas);
    this.mouseHandler = new MouseHandler(this);
    this.loadImages();
    // if debug query param is present, enable debug mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("debug")) {
      this.debug = true;
      this.money = 10000;
    }
    initUi(this);
  }

  getNumberOfMonstersPerWave() {
    return 20 + (this.level.wave - 1) * 2;
  }

  startWave() {
    if (
      this.#health <= 0 ||
      (this.tempCounter < this.getNumberOfMonstersPerWave() &&
        this.tempCounter !== -1)
    ) {
      return;
    }
    this.level.wave++;
    this.tempCounter = 0;
    console.log(
      `Starting wave ${
        this.level.wave
      }. ${this.getNumberOfMonstersPerWave()} monsters with ${this.getHealth()} health and ${this.getSpeed()} speed`
    );
    this.spawnMonsters();
  }

  spawnMonsters() {
    setTimeout(() => {
      if (this.tempCounter < this.getNumberOfMonstersPerWave()) {
        this.spawnMonster();
        this.tempCounter++;
        this.spawnMonsters();
      }
    }, this.gameSpeed / 2 / this.getSpeed());
  }

  getSpeed() {
    let speed = 1;
    if (this.level.wave > 2) {
      speed += (this.level.wave - 2) * 0.4;
    }

    return Math.min(speed, 15);
  }

  getHealth() {
    let health = 100;
    const baseHealthIncrease = 15;
    let healthIncrease = 0;
    for (let i = 0; i < this.level.wave; i += 2) {
      healthIncrease += baseHealthIncrease * (i / 1.75);
      healthIncrease += Math.pow(i, 2);
    }
    return Math.floor(health + healthIncrease);
  }

  spawnMonster() {
    this.level.monsters.push(
      new Monster({
        game: this,
        health: this.getHealth(),
        speed: this.getSpeed(),
        damage: 1,
        reward: 10 + Math.floor(this.level.wave / 2),
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
      "tower-lightning",
      "tower-lightning-2",
      "tower-poison",
      "arrow",
      "bullet-1",
      "bullet-2",
      "bullet-3",
      "bullet-4",
      "fire-1",
      "fire-2",
      "frost-1",
      "frost-2",
      "frost-3",
      "frost-4",
      "frost-5",
      "frost-6",
      "frost-7",
      "frost-8",
      "frost-9",
      "frost-10",
      "frost-11",
      "frost-12",
      "frost-13",
      "crystal",
      "poison-1",
      "poison-2",
      "poison-3",
      "poison-4",
      "poison-5",
      "poison-6",
      "poison-7",
      "poison-8",
      "lightning-1",
      "lightning-2",
    ];
    imageNames.forEach((name) => {
      const img = new Image();
      img.src = `./assets/${name}.png`;
      this.images[name] = img;
    });
  }

  update() {
    if (this.#paused) {
      return;
    }
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
    this.level.monsters = this.level.monsters
      .filter((monster) => {
        return (
          monster.isAlive() &&
          monster.distance < this.level.mapMatrix.totalDistance
        );
      })
      .sort((a, b) => b.distance - a.distance);
    monstersInEnd.forEach((monster) => {
      console.log(`Monster reached the end, -${monster.damage} health`);
      this.health -= monster.damage;
    });
    this.level.monsters.forEach((monster) => {
      monster.update();
    });
    this.level.towers.forEach((tower) => {
      tower.update();
    });
    this.projectiles.forEach((projectile) => {
      projectile.update();
    });
    if (this.#health < 0) {
      if (confirm("Game Over! Play again?")) {
        window.location.reload();
      }
    }
    if (deadMonsters.length > 0 || monstersInEnd.length > 0) {
      updateMonsterCount(this.level.monsters.length);
    }
    if (this.level.monsters.length === 0) {
      console.log(`Wave ${this.level.wave} completed!`);
      if ((document.getElementById("automode") as HTMLInputElement)?.checked) {
        this.startWave();
      }
    }
  }

  render() {
    try {
      this.drawGrid();
      this.level.monsters.forEach((monster) => {
        monster.render();
      });
      this.level.towers.forEach((tower) => {
        tower.render();
      });
      this.projectiles.forEach((projectile) => {
        projectile.render();
      });
      if (this.#health <= 0) {
        this.ctx.save();
        this.ctx.fillStyle = "red";
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
          "Game Over!",
          this.canvas.width / 2,
          this.canvas.height / 1.5
        );
        this.ctx.restore();
      }
      if (this.#newTower && this.hoveredCell) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.25;
        // Draw a circle indicating the tower's range
        this.ctx.beginPath();
        this.ctx.arc(
          this.hoveredCell.col * this.squareSize + this.squareSize / 2,
          this.hoveredCell.row * this.squareSize + this.squareSize / 2,
          this.#newTower.range * this.squareSize,
          0,
          2 * Math.PI
        );
        this.ctx.fillStyle = "purple";
        this.ctx.globalAlpha = 0.5;
        this.#newTower.gridPosition = this.hoveredCell!;
        this.#newTower.render();

        this.ctx.fill();

        this.ctx.restore();
      }
    } catch (e) {
      console.error(e);
      if (this.debug) {
        alert(`Error rendering game: ${e}`);
      }
    }
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
            this.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
          } else if (cell === UNSET_CELL) {
            this.ctx.fillStyle = "green";
          } else {
            this.ctx.fillStyle = "green";
          }
        } else if (Array.isArray(cell) && cell.includes(0)) {
          this.ctx.fillStyle = "blue";
        } else if (Array.isArray(cell) && cell.length > 0) {
          this.ctx.fillStyle = "rgb(200, 200, 200)";
        }
        this.ctx.fillRect(
          x * this.squareSize,
          y * this.squareSize,
          this.squareSize,
          this.squareSize
        );
        if (this.debug) {
          this.ctx.save();
          this.ctx.fillStyle = "black";
          this.ctx.font = "12px Arial";
          if (Array.isArray(cell) && cell.length > 0) {
            this.ctx.fillText(
              cell.toString(),
              x * this.squareSize + 5,
              y * this.squareSize + 15
            );
          } else if (cell === START_CELL) {
            this.ctx.fillText(
              START_CELL,
              x * this.squareSize + 5,
              y * this.squareSize + 15
            );
          } else if (cell === END_CELL) {
            this.ctx.fillText(
              END_CELL,
              x * this.squareSize + 5,
              y * this.squareSize + 15
            );
          }
          this.ctx.font = "10px Arial";
          this.ctx.fillText(
            `${x},${y}`,
            x * this.squareSize + 20,
            y * this.squareSize + 40
          );
          this.ctx.restore();
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

  convertGridPositionToCoordinates(gridPosition: GridPosition): Coordinates {
    return {
      x: gridPosition.col * this.squareSize + this.squareSize / 2,
      y: gridPosition.row * this.squareSize + this.squareSize / 2,
    };
  }

  upgradeTower(stat: string) {
    switch (stat) {
      case "damage":
        console.log("TODO: Implement damage upgrade");
        break;
      case "range":
        console.log("TODO: Implement range upgrade");
        break;
      case "speed":
        console.log("TODO: Implement speed upgrade");
        break;
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

  get newTower(): TowerType | null {
    return this.#newTower?.type || null;
  }
  set newTower(value: TowerType | null) {
    this.#newTower = value
      ? new TowerClasses[value](this, this.hoveredCell!)
      : null;
  }

  get paused(): boolean {
    return this.#paused;
  }
  set paused(value: boolean) {
    const now = Date.now();
    this.level.towers.forEach((tower) => {
      tower.lastAttackTime = now;
    });
    this.level.monsters.forEach((monster) => {
      monster.lastUpdateTime = now;
    });
    this.projectiles.forEach((projectile) => {
      projectile.lastMoveTime = now;
    });
    this.#paused = value;
  }
}
