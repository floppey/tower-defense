import { Game } from "../classes/Game";
import Tower from "../classes/towers/Tower";
import { TOWER_CELL, UNSET_CELL } from "../constants/mapMatrixConstants";
import { prices, TowerClasses } from "../constants/towers";
import { Coordinates, GridPosition } from "../types/types";
import { getTowerSellPrice } from "../util/getTowerSellPrice";

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

    this.game.canvas.addEventListener("contextmenu", (event) => {
      this.handleContextMenu(event);
    });
  }

  handleClick() {
    const cell = this.getCellAtMousePosition();
    let clicked = false;
    this.game.dialogs?.forEach((dialog) => {
      dialog.buttons?.forEach((button) => {
        clicked = clicked || button.handleClick(this.mousePosition);
      });
    });
    if (clicked) return;
    if (
      this.game.newTower &&
      this.game.level.mapMatrix.matrix[cell.col][cell.row] === UNSET_CELL
    ) {
      if (this.game.money >= prices[this.game.newTower]) {
        this.game.level.mapMatrix.matrix[cell.col][cell.row] = TOWER_CELL;
        this.game.level.towers.push(
          new TowerClasses[this.game.newTower](this.game, cell, "basic")
        );
        this.game.money -= prices[this.game.newTower];
        if (this.game.money < prices[this.game.newTower]) {
          this.game.newTower = null;
        }
      }
    } else if (this.game.newTower === null) {
      const tower = this.getTowerInCell(cell);
      if (tower) {
        this.game.selectedTower = tower;
      } else {
        this.game.selectedTower = null;
      }
    } else if (this.game.newTower) {
      this.game.newTower = null;
    }
  }

  getTowerInCell(cell: GridPosition): Tower | undefined {
    return this.game.level.towers.find(
      (tower) =>
        tower.gridPosition.col === cell.col &&
        tower.gridPosition.row === cell.row
    );
  }

  handleContextMenu(event: MouseEvent) {
    event.preventDefault();
    const cell = this.getCellAtMousePosition();
    if (this.game.newTower) {
      this.game.newTower = null;
    } else if (
      this.game.level.mapMatrix.matrix[cell.col][cell.row] === TOWER_CELL
    ) {
      const tower = this.getTowerInCell(cell);
      if (tower) {
        this.game.paused = true;
        if (confirm(`Sell for ${getTowerSellPrice(tower)} coins?`)) {
          this.game.level.towers = this.game.level.towers.filter(
            (t) => t.id !== tower.id
          );
          this.game.level.mapMatrix.matrix[cell.col][cell.row] = UNSET_CELL;
          tower.onSell();
        }
        this.game.paused = false;
      }
    }
  }
}
