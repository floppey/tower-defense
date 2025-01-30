import { UNSET_CELL, END_CELL } from "../constants/mapMatrixConstants";
import { GridPosition, Map } from "../types/types";
import { Entity } from "./Entity";
import { Level } from "./Level";

export class MapMatrix extends Entity {
  matrix: Map;
  level: Level;
  totalDistance = 0;
  distanceToPositionMap: { [key: number]: GridPosition } = {};

  constructor(level: Level, map?: Map) {
    super();
    this.level = level;
    this.matrix = {};
    if (map) {
      this.matrix = map;

      Object.values(map).forEach((col) => {
        Object.values(col).forEach((cell) => {
          if (Array.isArray(cell)) {
            this.totalDistance = Math.max(...cell, this.totalDistance);
          }
        });
      });
    } else {
      this.generateMapMatrix();
    }
  }

  initMatrix(): void {
    const { gridWidth, gridHeight } = this.level.game;
    this.matrix = Array.from({ length: gridWidth }, () =>
      Array(gridHeight).fill(UNSET_CELL)
    );

    // Set the start and end positions
    this.level.startPositions?.forEach((pos) => {
      this.matrix[pos.col][pos.row] = [0];
    });
    this.level.endPositions?.forEach((pos) => {
      this.matrix[pos.col][pos.row] = END_CELL;
    });
  }

  generateMapMatrix(): void {
    this.level.startPositions?.forEach((startPos) => {
      let attempts = 0;

      do {
        this.initMatrix();
        this.totalDistance = this.buildPath(startPos.col, startPos.row, 1);
        attempts++;
      } while (
        (this.totalDistance < this.level.minLength ||
          this.totalDistance > this.level.maxLength) &&
        attempts < 100
      );
      if (attempts >= 100) {
        console.log("Failed to generate path");
      }
    });
  }

  /**
   * Recursively and randomly build the path from the start position to the end position
   */
  buildPath(col: number, row: number, pathNumber: number): number {
    const neighbors = this.getNeighbors(col, row);

    // Check if we've reached the end position
    if (neighbors.some(({ row, col }) => this.getCell(col, row) === END_CELL)) {
      return pathNumber;
    }

    // Find the valid neighbors that can be a path
    const validPathNeighbors = neighbors.filter(({ col, row }) =>
      this.canBePath(col, row, pathNumber)
    );
    if (validPathNeighbors.length === 0) {
      return -1;
    }
    // Pick a random neighbor to continue the path
    const randomNeighbor =
      validPathNeighbors[Math.floor(Math.random() * validPathNeighbors.length)];
    const matrixPosition = this.matrix[randomNeighbor.col][randomNeighbor.row];
    if (Array.isArray(matrixPosition)) {
      matrixPosition.push(pathNumber);
    } else {
      this.matrix[randomNeighbor.col][randomNeighbor.row] = [pathNumber];
    }

    // Recursively build the path
    return this.buildPath(
      randomNeighbor.col,
      randomNeighbor.row,
      pathNumber + 1
    );
  }

  getNeighbors(col: number, row: number): Array<GridPosition> {
    const neighbors = [];
    if (col > 0) {
      neighbors.push({ col: col - 1, row });
    }
    if (col < this.level.game.gridWidth - 1) {
      neighbors.push({ col: col + 1, row });
    }
    if (row > 0) {
      neighbors.push({ col, row: row - 1 });
    }
    if (row < this.level.game.gridHeight - 1) {
      neighbors.push({ col, row: row + 1 });
    }
    return neighbors;
  }

  getCell(col: number, row: number): number[] | string {
    return this.matrix[col][row];
  }

  canBePath(col: number, row: number, pathNumber: number): boolean {
    const cell = this.getCell(col, row);
    // Check if the cell is not set, or if it's a path
    if (cell !== UNSET_CELL && Array.isArray(cell) === false) {
      return false;
    }
    // Check if the cell path is too close to the current position
    if (Array.isArray(cell) && cell.some((pn) => pn > pathNumber - 10)) {
      return false;
    }

    const neighbors = this.getNeighbors(col, row);
    // Check if the cell has more than one neighbor that is a path
    if (
      neighbors.filter(({ col, row }) => {
        const cell = this.getCell(col, row);
        if (!Array.isArray(cell)) {
          return false;
        }
        if (cell.some((pn) => pn > pathNumber - 10)) {
          return true;
        }
        return false;
      }).length > 1
    ) {
      return false;
    }
    if (Array.isArray(cell) && cell.length >= this.level.maxRepeatSquares) {
      return false;
    }
    return true;
  }

  getPathPosition(distance: number): GridPosition {
    const intDistance = Math.ceil(distance);
    if (this.distanceToPositionMap[intDistance]) {
      return this.distanceToPositionMap[intDistance];
    }
    let position: GridPosition =
      intDistance <= 0
        ? this.level.startPositions[
            Math.floor(Math.random() * this.level.startPositions.length)
          ]
        : this.level.endPositions[0];
    Object.keys(this.matrix).forEach((xKey) => {
      const col = Number(xKey);
      Object.keys(this.matrix[col]).forEach((yKey) => {
        const row = Number(yKey);
        const cell = this.matrix[col][row];
        if (Array.isArray(cell) && cell.includes(intDistance)) {
          position = { row, col };

          return;
        }
      });
    });
    this.distanceToPositionMap[intDistance] = position;
    return position;
  }
}
