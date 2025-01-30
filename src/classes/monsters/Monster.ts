import { MonsterType } from "../../constants/monsters";
import {
  Coordinates,
  Debuff,
  Direction,
  GridPosition,
} from "../../types/types";
import { Entity } from "../Entity";
import { Game } from "../Game";

export interface MonsterConstructor {
  game: Game;
  health: number;
  speed: number;
  damage: number;
  reward: number;
  type: MonsterType;
  path: string;
}

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
  monsterSize: number;
  type: MonsterType;
  path: string;

  constructor({
    game,
    health,
    speed,
    damage,
    reward,
    type,
    path,
  }: MonsterConstructor) {
    super();
    this.game = game;
    this.health = health;
    this.maxHealth = health;
    this.speed = speed;
    this.#baseSpeed = speed;
    this.distance = 0;
    this.path = path;
    this.gridPosition = this.game.level.mapMatrix.getPathPosition(0, this.path);
    this.nextPosition = this.game.level.mapMatrix.getPathPosition(
      0.5,
      this.path
    );
    this.direction = this.getDirection(this.nextPosition);
    this.damage = damage;
    this.reward = reward;
    this.monsterSize = this.game.squareSize / 1.5;
    this.type = type;
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
        // Deal a maximum of 1000 damage per second
        const maxDamage = Math.min(this.maxHealth * 0.05, 1000);
        const poisonDamage =
          (timeSinceLastUpdate / this.game.gameSpeed) * maxDamage;
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
      this.nextPosition = this.game.level.mapMatrix.getPathPosition(
        newDistance,
        this.path
      );
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

    let x = col * squareSize;
    let y = row * squareSize;

    if (this.direction === "up") {
      x += squareSize / 2 - this.monsterSize / 2;
      y += squareSize - partialDistance * squareSize;
    } else if (this.direction === "down") {
      x += squareSize / 2 - this.monsterSize / 2;
      y += partialDistance * squareSize;
    } else if (this.direction === "left") {
      x += squareSize - partialDistance * squareSize;
      y += squareSize / 2 - this.monsterSize / 2;
    } else if (this.direction === "right") {
      x += partialDistance * squareSize;
      y += squareSize / 2 - this.monsterSize / 2;
    } else if (this.direction === "none") {
      x += squareSize / 2 - this.monsterSize / 2;
      y += squareSize / 2 - this.monsterSize / 2;
    }
    return { x, y };
  }

  render() {
    const coords = this.getCanvasPosition();
    if (!coords) {
      return;
    }
    const { ctx } = this.game;
    const { x, y } = coords;

    const sprite = this.getSprite();
    const spriteSize = 128;
    const { row, numberOfFrames } =
      this.getWalkingAnimationRowAndNumberOfFrames();
    const frame = Math.floor(this.distance * numberOfFrames) % numberOfFrames;
    const spriteX = frame * spriteSize;
    const spriteY = row * spriteSize;

    ctx.save();

    // Mirror the sprite if the monster is moving left
    if (this.direction === "left") {
      ctx.translate(x + this.monsterSize / 2, y);
      ctx.scale(-1, 1);
      ctx.translate(-x - this.monsterSize / 2, -y);
    }

    ctx.drawImage(
      sprite,
      spriteX,
      spriteY + 5, // +5 to offset the sprite
      spriteSize,
      spriteSize,
      x,
      y,
      this.monsterSize,
      this.monsterSize
    );

    ctx.restore();
    ctx.save();

    // Draw health bar
    ctx.fillStyle = "red";
    ctx.fillStyle = "green";
    ctx.fillRect(
      x + 10,
      y,
      ((this.monsterSize - 20) * this.health) / this.maxHealth,
      5
    );

    ctx.restore();
  }

  getSprite(): HTMLImageElement {
    switch (this.type) {
      case "skeleton":
        if (this.isFrozen()) {
          return this.game.images["monsters/SkeletonFrozen"];
        }
        if (this.isPoisoned()) {
          return this.game.images["monsters/SkeletonPoisoned"];
        }
        return this.game.images["monsters/Skeleton"];
      case "plant":
        if (this.isFrozen()) {
          return this.game.images["monsters/PlantFrozen"];
        }
        if (this.isPoisoned()) {
          return this.game.images["monsters/PlantPoisoned"];
        }
        return this.game.images["monsters/Plant"];
      case "orcWarrior":
        if (this.isFrozen()) {
          return this.game.images["monsters/OrcWarriorFrozen"];
        }
        if (this.isPoisoned()) {
          return this.game.images["monsters/OrcWarriorPoisoned"];
        }
        return this.game.images["monsters/OrcWarrior"];
      case "fireSpirit":
        if (this.isFrozen()) {
          return this.game.images["monsters/FireSpiritFrozen"];
        }
        if (this.isPoisoned()) {
          return this.game.images["monsters/FireSpiritPoisoned"];
        }
        return this.game.images["monsters/FireSpirit"];
      default:
        console.error("Invalid monster type", this.type);
        return this.game.images["monsters/Skeleton"];
    }
  }

  isFrozen(): boolean {
    return this.debuffs.some((debuff) => debuff.type === "freeze");
  }

  isPoisoned(): boolean {
    return this.debuffs.some((debuff) => debuff.type === "poison");
  }

  getWalkingAnimationRowAndNumberOfFrames(): {
    numberOfFrames: number;
    row: number;
  } {
    switch (this.type) {
      case "skeleton":
        return {
          row: 1,
          numberOfFrames: 8,
        };
      case "plant":
        return {
          row: 2,
          numberOfFrames: 9,
        };
      case "orcWarrior":
        return {
          row: 9,
          numberOfFrames: 7,
        };
      case "fireSpirit":
        return {
          row: 5,
          numberOfFrames: 7,
        };
      default:
        console.error("Invalid monster type", this.type);
        return {
          row: 0,
          numberOfFrames: 0,
        };
    }
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
