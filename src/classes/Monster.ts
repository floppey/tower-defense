import { Coordinates, Debuff, Direction, GridPosition } from "../types/types";
import { Entity } from "./Entity";
import { Game } from "./Game";

export default class Monster extends Entity {
  game: Game;
  health: number;
  maxHealth: number;
  speed: number;
  #baseSpeed: number;
  gridPosition: GridPosition | null;
  nextPosition: GridPosition | null;
  /** The distance the monster has traveled. This is used to keep track of how far along in the path it is */
  distance: number;
  damage: number;
  lastUpdateTime: number = Date.now();
  direction: Direction;
  reward: number;
  debuffs: Debuff[] = [];

  constructor({
    game,
    health,
    speed,
    damage,
    reward,
  }: {
    game: Game;
    health: number;
    speed: number;
    damage: number;
    reward: number;
  }) {
    super();
    this.game = game;
    this.health = health;
    this.maxHealth = health;
    this.speed = speed;
    this.#baseSpeed = speed;
    this.distance = 0;
    this.gridPosition = this.game.level.mapMatrix.getPathPosition(0);
    this.nextPosition = this.game.level.mapMatrix.getPathPosition(0.5);
    this.direction = this.getDirection(this.nextPosition);
    this.damage = damage;
    this.reward = reward;
  }

  getDirection(nextGridPosition: GridPosition): Direction {
    if (!this.gridPosition) {
      return "none";
    }
    if (nextGridPosition.col > this.gridPosition.col) {
      return "right";
    } else if (nextGridPosition.col < this.gridPosition.col) {
      return "left";
    } else if (nextGridPosition.row > this.gridPosition.row) {
      return "down";
    } else if (nextGridPosition.row < this.gridPosition.row) {
      return "up";
    }
    return "none";
  }

  addDebuff(debuff: Debuff) {
    this.debuffs.push({
      ...debuff,
      duration: Date.now() + debuff.duration,
    });
  }

  applyDebuffs() {
    const currentTime = Date.now();
    let speed = this.#baseSpeed;

    this.debuffs = this.debuffs.filter((debuff) => {
      if (currentTime > debuff.duration) {
        return false;
      }
      return true;
    });

    let hasAppliedPoison = false;
    this.debuffs.forEach((debuff) => {
      // Halve the speed of the monster if it is frozen
      if (debuff.type === "freeze") {
        speed /= 2;
      }
      // Deal 5% of the monster's max health as damage every second if it is poisoned
      else if (debuff.type === "poison" && !hasAppliedPoison) {
        hasAppliedPoison = true;
        const timeSinceLastUpdate = currentTime - this.lastUpdateTime;
        const poisonDamage =
          (timeSinceLastUpdate / this.game.gameSpeed) * (this.maxHealth * 0.05);
        this.takeDamage(poisonDamage);
      }
    });

    this.speed = Math.max(speed, this.#baseSpeed / 5);
  }

  update() {
    this.applyDebuffs();
    const currentTime = Date.now();
    const timeSinceLastUpdate = currentTime - this.lastUpdateTime;
    const distanceToTravel =
      (timeSinceLastUpdate / this.game.gameSpeed) * this.speed;
    const newDistance = this.distance + distanceToTravel;

    if (Math.floor(newDistance) > Math.floor(this.distance)) {
      this.gridPosition = this.nextPosition;
      this.nextPosition =
        this.game.level.mapMatrix.getPathPosition(newDistance);
    }

    if (
      this.nextPosition &&
      newDistance % 1 > 0.5 &&
      this.distance % 1 <= 0.5
    ) {
      this.direction = this.getDirection(this.nextPosition);
    }
    this.distance = newDistance;
    this.lastUpdateTime = currentTime;
  }

  getCanvasPosition(): Coordinates | null {
    if (!this.gridPosition) {
      return null;
    }
    const { row, col } = this.gridPosition;
    const partialDistance = this.distance % 1;
    const { squareSize } = this.game;
    const monsterSize = squareSize / 4;
    let x = col * squareSize;
    let y = row * squareSize;

    if (this.direction === "up") {
      x += squareSize / 2 - monsterSize / 2;
      y += squareSize - partialDistance * squareSize;
    } else if (this.direction === "down") {
      x += squareSize / 2 - monsterSize / 2;
      y += partialDistance * squareSize;
    } else if (this.direction === "left") {
      x += squareSize - partialDistance * squareSize;
      y += squareSize / 2 - monsterSize / 2;
    } else if (this.direction === "right") {
      x += partialDistance * squareSize;
      y += squareSize / 2 - monsterSize / 2;
    } else if (this.direction === "none") {
      x += squareSize / 2 - monsterSize / 2;
      y += squareSize / 2 - monsterSize / 2;
    }
    return { x, y };
  }

  render() {
    const coords = this.getCanvasPosition();
    if (!coords) {
      return;
    }
    const { squareSize, ctx } = this.game;
    const monsterSize = squareSize / 3;
    const { x, y } = coords;

    ctx.fillStyle = "black";
    ctx.fillRect(x, y, monsterSize, monsterSize);
    ctx.fillRect(x, y - 10, monsterSize, 5);
    if (this.debuffs.some((debuff) => debuff.type === "freeze")) {
      ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
      ctx.fillRect(x, y, monsterSize, monsterSize);
    }
    if (this.debuffs.some((debuff) => debuff.type === "poison")) {
      ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
      ctx.fillRect(x, y, monsterSize, monsterSize);
    }
    // Draw health bar
    ctx.fillStyle = "red";
    ctx.fillStyle = "green";
    ctx.fillRect(x, y - 10, (monsterSize * this.health) / this.maxHealth, 5);
  }

  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  isAlive(): boolean {
    return this.health > 0;
  }
}
