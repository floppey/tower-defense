import { Game } from "../classes/Game";
import { ArrowTower } from "../classes/towers/ArrowTower";
import { CannonTower } from "../classes/towers/CannonTower";
import { FireTower } from "../classes/towers/FireTower";
import Tower from "../classes/towers/Tower";
import { TOWER_CELL, UNSET_CELL } from "../constants/mapMatrixConstants";
import { prices } from "../constants/prices";
import { Coordinates, GridPosition } from "../types/types";

export class MouseHandler {
  game: Game;
  mousePosition: Coordinates;

  constructor(game: Game) {
    this.game = game;
    this.mousePosition = { x: 0, y: 0 };
    this.init();
  }

  getCellAtMousePosition(): GridPosition {
    const { x, y } = this.mousePosition;
    const { squareSize } = this.game;
    const col = Math.floor(x / squareSize);
    const row = Math.floor(y / squareSize);

    return { row, col };
  }

  init() {
    this.game.canvas.addEventListener("mousemove", (event) => {
      const rect = this.game.canvas.getBoundingClientRect();
      this.mousePosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      this.game.hoveredCell = this.getCellAtMousePosition();
    });

    this.game.canvas.addEventListener("click", () => {
      this.handleClick();
    });
  }

  handleClick() {
    const cell = this.getCellAtMousePosition();
    if (this.game.level.mapMatrix.matrix[cell.col][cell.row] === UNSET_CELL) {
      if (this.game.money >= prices.newTower) {
        this.game.level.mapMatrix.matrix[cell.col][cell.row] = TOWER_CELL;
        this.game.level.towers.push(new Tower(this.game, cell));
        this.game.money -= prices.newTower;
      }
    } else if (
      this.game.level.mapMatrix.matrix[cell.col][cell.row] === TOWER_CELL
    ) {
      let towerToUpgrade = this.game.level.towers.find((tower) => {
        return (
          tower.gridPosition.col === cell.col &&
          tower.gridPosition.row === cell.row
        );
      });
      if (towerToUpgrade) {
        if (
          towerToUpgrade.type === "basic" &&
          this.game.money >= prices.arrowTower
        ) {
          this.game.level.towers = this.game.level.towers.filter((tower) => {
            return tower.id !== towerToUpgrade.id;
          });
          this.game.level.towers.push(new ArrowTower(this.game, cell));
          this.game.money -= prices.arrowTower;
        } else if (
          towerToUpgrade.type === "arrow" &&
          this.game.money >= prices.cannonTower
        ) {
          this.game.level.towers = this.game.level.towers.filter((tower) => {
            return tower.id !== towerToUpgrade.id;
          });
          this.game.level.towers.push(new CannonTower(this.game, cell));
          this.game.money -= prices.cannonTower;
        } else if (
          towerToUpgrade.type === "cannon" &&
          this.game.money >= prices.fireTower
        ) {
          this.game.level.towers = this.game.level.towers.filter((tower) => {
            return tower.id !== towerToUpgrade.id;
          });
          this.game.level.towers.push(new FireTower(this.game, cell));
          this.game.money -= prices.fireTower;
        }
      }
    }
  }
}
