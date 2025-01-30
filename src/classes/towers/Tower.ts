import { GridPosition, TowerType } from "../../types/types";
import { Entity } from "../Entity";
import { Game } from "../Game";
import Monster from "../monsters/Monster";
import { Arrow } from "../projectiles/Arrow";

export default class Tower extends Entity {
  game: Game;
  gridPosition: GridPosition;
  range: number = 4;
  damage: number = 25;
  attackSpeed: number = 1;
  lastAttackTime: number = Date.now();
  placed: boolean = false;
  type: TowerType = "basic";
  multiTarget: boolean = false;

  constructor(game: Game, gridPosition: GridPosition) {
    super();
    this.game = game;
    this.gridPosition = gridPosition;
  }

  getImage() {
    let images = [this.game.images[`tower-${this.type}`]];
    if (this.type === "lightning") {
      images = [
        this.game.images[`tower-${this.type}`],
        this.game.images[`tower-${this.type}-2`],
      ];
    }
    // Cycle through images over 1 second
    const numberOfImages = images.length;
    const imageIndex = Math.floor(
      (Date.now() / this.game.gameSpeed) % numberOfImages
    );
    const image = images[imageIndex];

    return image;
  }

  render() {
    const { squareSize } = this.game;
    const { col, row } = this.gridPosition;
    const x = col * squareSize;
    const y = row * squareSize;

    const image = this.getImage();
    try {
      this.game.ctx.drawImage(image, x, y, squareSize, squareSize);
    } catch (e) {
      console.error(e);
      if (this.game.debug) {
        alert(`Error rendering tower ${image}: ${e}`);
      }
    }
  }

  update() {
    this.attack();
  }

  monsterIsValidTarget(monster: Monster) {
    if (!monster.gridPosition || !monster.isAlive()) {
      return false;
    }

    const { col, row } = this.gridPosition;

    const monsterCol = monster.gridPosition.col;
    const monsterRow = monster.gridPosition.row;

    const distance = Math.sqrt(
      Math.pow(monsterCol - col, 2) + Math.pow(monsterRow - row, 2)
    );
    return Math.abs(distance) <= this.range;
  }

  getTargetInRange(): Monster | undefined {
    return this.getTargetsInRange()[0];
  }

  getTargetsInRange(): Monster[] {
    const { monsters } = this.game.level;

    return (
      monsters.filter((monster) => {
        return this.monsterIsValidTarget(monster);
      }) ?? []
    );
  }

  canAttack() {
    const currentTime = Date.now();
    const timeSinceLastAttack = currentTime - this.lastAttackTime;
    return timeSinceLastAttack > this.game.gameSpeed / this.attackSpeed;
  }

  attack() {
    const currentTime = Date.now();

    if (this.canAttack()) {
      const target = this.getTargetInRange();
      if (target) {
        this.game.projectiles.push(
          new Arrow({
            game: this.game,
            target,
            position: this.game.convertGridPositionToCoordinates(
              this.gridPosition
            ),
            damage: this.damage,
            speed: this.game.gameSpeed / 4,
          })
        );
        // Add a random delay to the next attack
        this.lastAttackTime =
          currentTime +
          (this.attackSpeed * (Math.random() * 0.025) - 0.0125) *
            this.game.gameSpeed;
      }
    }
  }
}
