import { GridPosition, TowerType } from "../../types/types";
import { Entity } from "../Entity";
import { Game } from "../Game";
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

  constructor(game: Game, gridPosition: GridPosition) {
    super();
    this.game = game;
    this.gridPosition = gridPosition;
  }

  render() {
    const { squareSize } = this.game;
    const { col, row } = this.gridPosition;
    const x = col * squareSize;
    const y = row * squareSize;

    const image = this.game.images[`tower-${this.type}`];

    this.game.ctx.drawImage(image, x, y, squareSize, squareSize);
  }

  update() {
    this.attack();
  }

  getTargetsInRange() {
    const { monsters } = this.game.level;
    const { col, row } = this.gridPosition;

    return monsters.find((monster) => {
      if (!monster.gridPosition || !monster.isAlive()) {
        return false;
      }

      const monsterCol = monster.gridPosition.col;
      const monsterRow = monster.gridPosition.row;

      const distance = Math.sqrt(
        Math.pow(monsterCol - col, 2) + Math.pow(monsterRow - row, 2)
      );
      return Math.abs(distance) <= this.range;
    });
  }

  attack() {
    const currentTime = Date.now();
    const timeSinceLastAttack = currentTime - this.lastAttackTime;

    if (timeSinceLastAttack > 1000 / this.attackSpeed) {
      const target = this.getTargetsInRange();
      if (target) {
        this.game.projectiles.push(
          new Arrow({
            game: this.game,
            target,
            position: this.game.convertGridPositionToCoordinates(
              this.gridPosition
            ),
            damage: this.damage,
            speed: 250,
          })
        );
        this.lastAttackTime = currentTime;
      }
    }
  }
}
