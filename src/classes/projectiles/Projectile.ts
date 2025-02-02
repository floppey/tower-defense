import { Debuff } from "../../constants/debuffs";
import { ImageName } from "../../constants/images";
import { Coordinates, GridPosition } from "../../types/types";
import { getDistanceBetweenCoordinates } from "../../util/getDistanceBetweenCoordinates";
import { Entity } from "../Entity";
import { Game } from "../Game";
import Monster from "../monsters/Monster";
import Tower from "../towers/Tower";

export interface ProjectileProps {
  game: Game;
  speed: number;
  damage: number;
  target: Monster | GridPosition;
  position: Coordinates;
  debuffs?: Debuff[] | null;
  splash?: number | null;
  tower: Tower;
}

export class Projectile extends Entity {
  game: Game;
  speed: number;
  damage: number;
  target: Monster | GridPosition;
  position: Coordinates;
  lastMoveTime: number;
  angle: number;
  height: number = 10;
  width: number = 10;
  images: ImageName[] = ["arrow"];
  splash: number | null = null;
  debuffs: Debuff[] | null = null;
  tower: Tower;

  constructor({
    game,
    speed,
    damage,
    target,
    position,
    splash,
    debuffs,
    tower,
  }: ProjectileProps) {
    super();
    this.game = game;
    this.speed = speed;
    this.damage = damage;
    this.target = target;
    this.position = position;
    this.angle = 0;
    this.splash = splash ?? null;
    this.debuffs = debuffs ?? null;
    this.lastMoveTime = Date.now();
    this.tower = tower;
  }

  impact() {
    const target = this.target;
    if (target instanceof Monster) {
      target.takeDamage(this.damage, this.tower.type);
      this.debuffs?.forEach((debuff) => {
        target.addDebuff(debuff);
      });
    }
    if (this.splash) {
      this.game.level.monsters.forEach((monster) => {
        if (target instanceof Monster && monster.id === target.id) {
          return;
        }
        const monsterCanvasPosition = monster.getCenter();
        if (!monsterCanvasPosition) {
          return;
        }
        const distance = getDistanceBetweenCoordinates(
          this.position,
          monsterCanvasPosition
        );
        if (distance <= this.splash! * this.game.squareSize) {
          monster.takeDamage(this.damage, this.tower.type);
          this.debuffs?.forEach((debuff) => {
            monster.addDebuff(debuff);
          });
        }
      });
    }
    this.game.projectiles = this.game.projectiles.filter(
      (projectile) => projectile.id !== this.id
    );
  }

  getImage() {
    // Cycle through images over 1 second
    const numberOfImages = this.images.length;
    const imageIndex = Math.floor(
      (Date.now() / this.game.gameSpeed) % numberOfImages
    );
    const image = this.images[imageIndex];

    return this.game.images[image];
  }

  getTargetPosition(): Coordinates {
    if (this.target instanceof Monster) {
      return this.target.getCenter()!;
    }
    return this.game.convertGridPositionToCoordinates(this.target);
  }

  update() {
    const currentTime = Date.now();
    const timeSinceLastMove = currentTime - this.lastMoveTime;
    const updateFactor = timeSinceLastMove / this.game.gameSpeed;
    this.speed *= 1 + 2 * updateFactor;
    const distanceToTravel =
      (timeSinceLastMove / this.game.gameSpeed) * this.speed;

    const targetPosition = this.getTargetPosition();

    const distanceToTarget = Math.sqrt(
      Math.pow(targetPosition.x - this.position.x, 2) +
        Math.pow(targetPosition.y - this.position.y, 2)
    );

    if (distanceToTravel > distanceToTarget) {
      this.position = targetPosition;
      this.lastMoveTime = currentTime;
      this.impact();
      return;
    }

    const angle = Math.atan2(
      targetPosition!.y - this.position.y,
      targetPosition!.x - this.position.x
    );
    const x = Math.cos(angle) * distanceToTravel;
    const y = Math.sin(angle) * distanceToTravel;
    // Rotate 180 degrees for rendering to make projectiles fly the correct way
    this.angle = angle + Math.PI;
    this.position = {
      x: this.position.x + x,
      y: this.position.y + y,
    };
    this.lastMoveTime = currentTime;
  }

  render() {
    const { ctx } = this.game;
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);
    try {
      ctx.drawImage(
        this.getImage(),
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height
      );
    } catch (e) {
      console.log(e);
      if (this.game.debug) {
        alert(`Error rendering projectile ${this.getImage().src}: ${e}`);
      }
    }
    ctx.restore();
  }
}
