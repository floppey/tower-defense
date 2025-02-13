import {
  END_CELL,
  START_CELL,
  UNSET_CELL,
} from "../constants/mapMatrixConstants";
import { prices, TowerClasses, TowerType } from "../constants/towers";
import { MouseHandler } from "../input/MouseHandler";
import { spiralMap } from "../maps/spiralMap";
import { Coordinates, GridPosition } from "../types/types";
import { initUi } from "../ui/initUi";
import { updateHealth } from "../ui/updateHealth";
import { updateKillCount } from "../ui/updateKillCount";
import { updateMoney } from "../ui/updateMoney";
import { updateMonsterCount } from "../ui/updateMonsterCount";
import BossMonster from "./monsters/BossMonster";
import { Level } from "./Level";
import Monster from "./monsters/Monster";
import { Projectile } from "./projectiles/Projectile";
import Tower from "./towers/Tower";
import { ImageName, imageNames } from "../constants/images";
import { MonsterType, monsterTypes } from "../constants/monsters";
import { burbenogMap } from "../maps/burbenogMap";
import { wintermaulMap } from "../maps/wintermaulMap";
import { getMonsterSpeed } from "../util/getMonsterSpeed";
import { getMonsterHealth } from "../util/getMonsterHealth";
import { isBossWave } from "../util/isBossWave";
import { getMonsterReward } from "../util/getMonsterReward";
import { getNumberOfMonstersPerWave } from "../util/getNumberOfMonstersPerWave";
import { Dialog } from "./ui/Dialog";
import { Button } from "./ui/Button";
import { getTowerStat } from "../util/getTowerStat";
import { getTowerUpgradeCost } from "../util/getTowerUpgradeCost";
import { formatBigNumber } from "../util/formatBigNumber";

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
  /* @ts-expect-error Images will be loaded in the constructor */
  images: Record<ImageName, HTMLImageElement> = {};
  tempCounter = -1;
  projectiles: Projectile[] = [];
  #newTower: Tower | null = null;
  #selectedTower: Tower | null = null;
  #paused = false;
  gameSpeed = 1000;
  backgroundImage: HTMLCanvasElement | null = null;
  completedWaves: Record<number, boolean> = {};
  damageLog: Record<string, number> = { max: 0 };
  dialogs: Dialog[] = [];
  lastRenderTime = Date.now();

  constructor() {
    this.canvas = document.createElement("canvas");
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("2d context not supported");
    }
    this.ctx = ctx;
    if (Math.random() > 0.75) {
      this.gridHeight = 30;
      this.gridWidth = 30;
      this.level = new Level({
        game: this,
        endPositions: [
          {
            col: 14,
            row: 15,
          },
        ],
        startPositions: [
          {
            col: 8,
            row: 0,
          },
          {
            col: 21,
            row: 0,
          },
          {
            col: 29,
            row: 21,
          },
          {
            col: 8,
            row: 29,
          },
        ],
        maxLength: 200,
        maxRepeatSquares: 1,
        minLength: 100,
        map: burbenogMap,
      });
    } else if (Math.random() > 0.75) {
      this.gridHeight = 48;
      this.gridWidth = 32;
      this.level = new Level({
        game: this,
        endPositions: [
          {
            col: 16,
            row: 47,
          },
        ],
        startPositions: [
          {
            col: 5,
            row: 0,
          },
          {
            col: 16,
            row: 0,
          },
          {
            col: 26,
            row: 0,
          },
        ],
        maxLength: 100,
        maxRepeatSquares: 1,
        minLength: 60,
        map: wintermaulMap,
      });
    } else if (Math.random() > 0.75) {
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
      let startPositions: GridPosition[] = [];
      do {
        startPositions.push({
          col: Math.floor(((Math.random() + 0.5) * this.gridHeight) / 2),
          row: Math.floor(((Math.random() + 0.5) * this.gridWidth) / 2),
        });
      } while (Math.random() > 0.85 && startPositions.length < 4);
      this.level = new Level({
        game: this,
        endPositions: [
          {
            col: Math.floor((Math.random() * this.gridHeight) / 2),
            row: Math.floor((Math.random() * this.gridWidth) / 2),
          },
        ],
        startPositions: startPositions,
        maxLength: 250,
        maxRepeatSquares: 3,
        minLength: 100,
      });
    }
    this.#health = 10 * this.level.startPositions.length;
    this.money = 100 + 50 * (this.level.startPositions.length - 1);
    this.canvas.width = this.squareSize * this.gridWidth;
    this.canvas.height = this.squareSize * this.gridHeight;

    document.body.appendChild(this.canvas);
    this.mouseHandler = new MouseHandler(this);
    this.loadImages();
    // if debug query param is present, enable debug mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("debug")) {
      this.debug = true;
      this.level.wave = Number(prompt("Wave to start from", "1")) - 1;
      this.money = Number(prompt("Money", "100"));
      /* @ts-expect-error Expose game object to window */
      window.getMonsterHealth = getMonsterHealth;
      /* @ts-expect-error Expose game object to window */
      window.getMonsterSpeed = getMonsterSpeed;
      /* @ts-expect-error Expose game object to window */
      window.getNumberOfMonstersPerWave = getNumberOfMonstersPerWave;
      /* @ts-expect-error Expose game object to window */
      window.isBossWave = isBossWave;
    }
    initUi(this);
  }

  canStartWave() {
    return (
      this.#health > 0 &&
      (this.tempCounter === getNumberOfMonstersPerWave(this.level.wave) ||
        this.tempCounter === -1)
    );
  }

  startWave() {
    if (!this.canStartWave()) {
      return;
    }
    this.level.wave++;
    this.tempCounter = 0;
    console.log(
      `Starting ${isBossWave(this.level.wave) ? "boss wave" : "wave"} ${
        this.level.wave
      }. ${getNumberOfMonstersPerWave(
        this.level.wave
      )} monsters with ${getMonsterHealth(this.level.wave).toLocaleString(
        "en-US"
      )} health and ${getMonsterSpeed(this.level.wave)} speed`
    );
    this.spawnMonsters();
  }

  spawnMonsters() {
    setTimeout(() => {
      if (this.tempCounter < getNumberOfMonstersPerWave(this.level.wave)) {
        this.level.startPositions.forEach((_, index) => {
          this.spawnMonster(`${index}`);
        });
        this.tempCounter++;
        this.spawnMonsters();
      }
    }, this.gameSpeed / 2 / getMonsterSpeed(this.level.wave));
  }

  spawnMonster(path: string) {
    const MonsterClass = isBossWave(this.level.wave) ? BossMonster : Monster;
    let monsterType: MonsterType;
    if (this.level.wave <= 10) {
      monsterType = "plant";
    } else if (this.level.wave <= 20) {
      monsterType = "skeleton";
    } else if (this.level.wave <= 30) {
      monsterType = "orcWarrior";
    } else if (this.level.wave <= 40) {
      monsterType = "fireSpirit";
    } else {
      monsterType =
        monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
    }
    this.level.monsters.push(
      new MonsterClass({
        game: this,
        health: getMonsterHealth(this.level.wave),
        speed: getMonsterSpeed(this.level.wave),
        damage: isBossWave(this.level.wave) ? 5 : 1,
        reward: getMonsterReward(this.level.wave),
        type: monsterType,
        path,
      })
    );
    updateMonsterCount(this.level.monsters.length);
  }

  loadImages() {
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
      (monster) =>
        monster.distance >= this.level.mapMatrix.totalDistances[monster.path]
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
          monster.distance < this.level.mapMatrix.totalDistances[monster.path]
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
    if (
      this.canStartWave() &&
      this.level.monsters.length === 0 &&
      this.completedWaves[this.level.wave] !== true
    ) {
      this.completedWaves[this.level.wave] = true;
      console.log(`Wave ${this.level.wave} completed!`);
      console.log("*** DAMAGE LOG ***");
      Object.keys(this.damageLog).forEach((key) => {
        console.log(
          `${key}: ${Math.round(this.damageLog[key]).toLocaleString()}`
        );
      });
      const autoStart = (
        document.getElementById("automode") as HTMLInputElement
      )?.checked;
      if (autoStart) {
        this.startWave();
      }
    }
  }

  render() {
    const renderStart = Date.now();
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

      if (this.selectedTower) {
        const { col, row } = this.selectedTower.gridPosition;

        this.ctx.save();
        this.ctx.globalAlpha = 0.25;
        // Draw a circle indicating the tower's range
        this.ctx.beginPath();
        this.ctx.arc(
          col * this.squareSize + this.squareSize / 2,
          row * this.squareSize + this.squareSize / 2,
          this.selectedTower.range * this.squareSize,
          0,
          2 * Math.PI
        );
        this.ctx.fillStyle = "blue";
        this.ctx.globalAlpha = 0.35;
        this.ctx.fill();
        this.ctx.restore();

        // Show tower stats
        let y = 0;
        this.ctx.save();
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(this.canvas.width - 200, y, 200, 140);
        y += 20;

        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
          `${this.selectedTower.type} tower`,
          this.canvas.width - 100,
          y
        );
        y += 20;
        this.ctx.textAlign = "left";
        this.ctx.fillText("Damage: ", this.canvas.width - 180, y);
        this.ctx.textAlign = "right";
        this.ctx.fillText(
          Math.round(this.selectedTower.damage).toLocaleString("en-US"),
          this.canvas.width - 20,
          y
        );
        y += 20;
        this.ctx.textAlign = "left";
        this.ctx.fillText("Speed: ", this.canvas.width - 180, y);
        this.ctx.textAlign = "right";
        this.ctx.fillText(
          this.selectedTower.attackSpeed.toLocaleString("en-US"),
          this.canvas.width - 20,
          y
        );
        y += 20;
        this.ctx.textAlign = "left";
        this.ctx.fillText("DPS: ", this.canvas.width - 180, y);
        this.ctx.textAlign = "right";
        this.ctx.fillText(
          Math.round(
            this.selectedTower.damage * this.selectedTower.attackSpeed
          ).toLocaleString("en-US"),
          this.canvas.width - 20,
          y
        );
        y += 20;
        this.ctx.textAlign = "left";
        this.ctx.fillText("Range: ", this.canvas.width - 180, y);
        this.ctx.textAlign = "right";
        this.ctx.fillText(
          Math.round(this.selectedTower.range).toLocaleString("en-US"),
          this.canvas.width - 20,
          y
        );
        y += 20;
        this.ctx.textAlign = "left";
        this.ctx.fillText("Splash: ", this.canvas.width - 180, y);
        this.ctx.textAlign = "right";
        this.ctx.fillText(
          this.selectedTower.splash
            ? this.selectedTower.splash.toLocaleString("en-US")
            : "❌",
          this.canvas.width - 20,
          y
        );
        this.ctx.restore();
      }

      this.dialogs.forEach((dialog) => dialog.draw());
    } catch (e) {
      console.error(e);
      if (this.debug) {
        alert(`Error rendering game: ${e}`);
      }
    }
    const renderEnd = Date.now();

    // Draw FPS in debug mode
    if (this.debug) {
      this.ctx.save();
      this.ctx.fillStyle = "black";
      this.ctx.font = "10px Arial";
      this.ctx.fillText(
        `FPS: ${Math.round(1000 / (renderEnd - this.lastRenderTime))}`,
        10,
        10
      );
      this.ctx.restore();
      const renderTime = renderEnd - renderStart;
      if (renderTime > 5) {
        console.log(`Render time: ${renderEnd - renderStart}ms`);
      }
    }
    this.lastRenderTime = renderEnd;
  }

  drawGrid(): void {
    if (!this.backgroundImage) {
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = this.canvas.width;
      offscreenCanvas.height = this.canvas.height;
      const offscreenCtx = offscreenCanvas.getContext("2d");
      if (!offscreenCtx) {
        throw new Error("2d context not supported");
      }

      offscreenCtx.clearRect(
        0,
        0,
        offscreenCanvas.width,
        offscreenCanvas.height
      );

      const { matrix } = this.level.mapMatrix;

      Object.keys(matrix).forEach((xKey) => {
        const x = Number(xKey);
        Object.keys(matrix[x]).forEach((yKey) => {
          const y = Number(yKey);
          const cell = matrix[x][y];

          offscreenCtx.save();

          if (typeof cell === "string") {
            if (cell === START_CELL) {
              offscreenCtx.fillStyle = "blue";
            } else if (cell === END_CELL) {
              offscreenCtx.fillStyle = "rgba(255, 0, 0, 0.5)";
            } else if (cell === UNSET_CELL) {
              offscreenCtx.fillStyle = "green";
            } else {
              offscreenCtx.fillStyle = "green";
            }
          } else if (
            Array.isArray(cell) &&
            cell.some((c) => c.distance === 0)
          ) {
            offscreenCtx.fillStyle = "blue";
          } else if (Array.isArray(cell) && cell.length > 0) {
            offscreenCtx.fillStyle = "rgb(200, 200, 200)";
          }
          offscreenCtx.fillRect(
            x * this.squareSize,
            y * this.squareSize,
            this.squareSize,
            this.squareSize
          );
          if (this.debug) {
            offscreenCtx.save();
            offscreenCtx.fillStyle = "black";
            offscreenCtx.font = "10px Arial";
            if (Array.isArray(cell) && cell.length > 0) {
              offscreenCtx.fillText(
                `${cell.map((c) => c.path + "-" + c.distance).join(", ")}`,
                x * this.squareSize + 5,
                y * this.squareSize + 15
              );
            } else if (cell === START_CELL) {
              offscreenCtx.fillText(
                START_CELL,
                x * this.squareSize + 5,
                y * this.squareSize + 15
              );
            } else if (cell === END_CELL) {
              offscreenCtx.fillText(
                END_CELL,
                x * this.squareSize + 5,
                y * this.squareSize + 15
              );
            }
            offscreenCtx.font = "10px Arial";
            offscreenCtx.fillText(
              `${x},${y}`,
              x * this.squareSize + 20,
              y * this.squareSize + 40
            );
            offscreenCtx.restore();
          }

          offscreenCtx.strokeStyle = "lightgray";
          offscreenCtx.strokeRect(
            x * this.squareSize,
            y * this.squareSize,
            this.squareSize,
            this.squareSize
          );

          offscreenCtx.restore();
        });
      });

      this.backgroundImage = offscreenCanvas;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(this.backgroundImage, 0, 0);

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

  upgradeTower(tower: Tower) {
    if (this.money >= getTowerUpgradeCost(tower)) {
      this.money -= getTowerUpgradeCost(tower);
      tower.level++;
      this.selectedTower = tower;
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
      ? new TowerClasses[value](this, this.hoveredCell!, "basic")
      : null;
  }

  get selectedTower(): Tower | null {
    return this.#selectedTower;
  }
  set selectedTower(value: Tower | null) {
    this.#selectedTower = value;

    this.dialogs = [];
    if (value) {
      const anchor = value.getCanvasPosition();
      const dialogWidth = 200;
      const dialogHeight = 200;

      anchor.x -= dialogWidth / 2;
      if (anchor.y > this.canvas.height / 2) {
        anchor.y -= dialogHeight;
      } else {
        anchor.y += this.squareSize;
      }

      // Make sure dialog is not offscreen
      anchor.x = Math.max(0, anchor.x);
      anchor.x = Math.min(this.canvas.width - dialogWidth, anchor.x);
      anchor.y = Math.max(0, anchor.y);
      anchor.y = Math.min(this.canvas.height - dialogHeight, anchor.y);

      const upgradeCost = getTowerUpgradeCost(value);

      const upgradeButton = new Button({
        game: this,
        text: `${upgradeCost.toLocaleString("en-US")}🪙 Upgrade`,
        position: {
          ...anchor,
          x: anchor.x + 25,
          y: anchor.y + 125,
        },
        onClick: () => this.upgradeTower(value),
        height: 50,
        width: 150,
      });

      const { level } = value;
      const nextLevel = level + 1;

      this.dialogs.push(
        new Dialog({
          game: this,
          height: dialogHeight,
          width: dialogWidth,
          position: anchor,
          texts: [
            `Level ${level} -> ${nextLevel}`,
            `Damage: ${formatBigNumber(
              Number(getTowerStat(value.type, "damage", level))
            )} -> ${formatBigNumber(
              Number(getTowerStat(value.type, "damage", nextLevel))
            )}`,
            `Attack Speed: ${getTowerStat(
              value.type,
              "attackSpeed",
              level
            )} -> ${getTowerStat(value.type, "attackSpeed", nextLevel)}`,
            `Range: ${getTowerStat(
              value.type,
              "range",
              level
            )} -> ${getTowerStat(value.type, "range", nextLevel)}`,
            `Splash: ${getTowerStat(
              value.type,
              "splash",
              level
            )} -> ${getTowerStat(value.type, "splash", nextLevel)}`,
          ],
          buttons: [upgradeButton],
        })
      );
    }
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
