import { Coordinates, Debuff, GridPosition } from "../../types/types";
import { getDistanceBetweenCoordinates } from "../../util/getDistanceBetweenCoordinates";
import { Entity } from "../Entity";
import { Game } from "../Game";
import Monster from "../Monster";

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
  images: string[] = ["arrow"];
  splash: number | null = null;
  debuffs: Debuff[] | null = null;

  constructor({
    game,
    speed,
    damage,
    target,
    position,
  }: {
    game: Game;
    speed: number;
    damage: number;
    target: Monster | GridPosition;
    position: Coordinates;
  }) {
    super();
    this.game = game;
    this.speed = speed;
    this.damage = damage;
    this.target = target;
    this.position = position;
    this.angle = 0;
    this.lastMoveTime = Date.now();
  }

  impact() {
    const target = this.target;
    if (target instanceof Monster) {
      target.takeDamage(this.damage);
      this.debuffs?.forEach((debuff) => {
        target.addDebuff(debuff);
      });
    }
    if (this.splash) {
      this.game.level.monsters.forEach((monster) => {
        if (target instanceof Monster && monster.id === target.id) {
          return;
        }
        const monsterCanvasPosition = monster.getCanvasPosition();
        if (!monsterCanvasPosition) {
          return;
        }
        const distance = getDistanceBetweenCoordinates(
          this.position,
          monsterCanvasPosition
        );
        if (distance <= this.splash! * this.game.squareSize) {
          monster.takeDamage(this.damage);
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
    const imageIndex = Math.floor((Date.now() / 1000) % numberOfImages);
    const image = this.images[imageIndex];

    return this.game.images[image];
  }

  update() {
    this.speed = this.speed * 1.05;
    const currentTime = Date.now();
    const timeSinceLastMove = currentTime - this.lastMoveTime;
    const distanceToTravel = (timeSinceLastMove / 1000) * this.speed;

    let targetPosition: Coordinates;
    if (this.target instanceof Monster) {
      targetPosition = this.target.getCanvasPosition()!;
    } else {
      targetPosition = this.game.convertGridPositionToCoordinates(this.target);
    }

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

    ctx.drawImage(
      this.getImage(),
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}
