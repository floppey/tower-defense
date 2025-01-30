import {
  END_CELL,
  START_CELL,
  UNSET_CELL,
} from "../../constants/mapMatrixConstants";
import { burbenogMap } from "../../maps/burbenogMap";
import { GridPosition, Map } from "../../types/types";
import { MapBuilderMouseHandler } from "./MapBuilderMouseHandler";

export class MapBuilder {
  squareSize: number = 32;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  mouseHandler: MapBuilderMouseHandler;
  mapMatrix: Map;
  hoveredCell: GridPosition | null = null;
  debug: boolean = true;
  width: number;
  height: number;
  currentPath: string = "0";
  currentDistance: number = 0;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canvas = document.createElement("canvas");
    this.canvas.width = width * this.squareSize;
    this.canvas.height = height * this.squareSize;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.mapMatrix = {};
    this.initMapMatrix();

    this.mouseHandler = new MapBuilderMouseHandler(this);

    document.body.appendChild(this.canvas);
  }

  render(): void {
    this.drawGrid();
  }

  initMapMatrix(): void {
    this.mapMatrix = Array.from({ length: this.width }, () =>
      Array(this.height).fill(UNSET_CELL)
    );
    this.mapMatrix = burbenogMap;
  }

  drawGrid(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    Object.keys(this.mapMatrix).forEach((xKey) => {
      const x = Number(xKey);
      Object.keys(this.mapMatrix[x]).forEach((yKey) => {
        const y = Number(yKey);
        const cell = this.mapMatrix[x][y];

        this.ctx.save();

        if (typeof cell === "string") {
          if (cell === START_CELL) {
            this.ctx.fillStyle = "blue";
          } else if (cell === END_CELL) {
            this.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
          } else if (cell === UNSET_CELL) {
            this.ctx.fillStyle = "green";
          } else {
            this.ctx.fillStyle = "green";
          }
        } else if (Array.isArray(cell) && cell.some((c) => c.distance === 0)) {
          this.ctx.fillStyle = "blue";
        } else if (Array.isArray(cell) && cell.length > 0) {
          this.ctx.fillStyle = "rgb(200, 200, 200)";
        }
        this.ctx.fillRect(
          x * this.squareSize,
          y * this.squareSize,
          this.squareSize,
          this.squareSize
        );
        if (this.debug) {
          this.ctx.save();
          this.ctx.fillStyle = "black";
          this.ctx.font = "10px Arial";
          if (Array.isArray(cell) && cell.length > 0) {
            this.ctx.fillText(
              `${cell.map((c) => c.path + "-" + c.distance).join(", ")}`,
              x * this.squareSize + 5,
              y * this.squareSize + 15
            );
          } else if (cell === START_CELL) {
            this.ctx.fillText(
              START_CELL,
              x * this.squareSize + 5,
              y * this.squareSize + 15
            );
          } else if (cell === END_CELL) {
            this.ctx.fillText(
              END_CELL,
              x * this.squareSize + 5,
              y * this.squareSize + 15
            );
          }
          this.ctx.fillStyle = "black";
          this.ctx.font = "8px Arial";
          this.ctx.fillText(
            `${x},${y}`,
            x * this.squareSize + 10,
            y * this.squareSize + 25
          );
          this.ctx.restore();
        }

        this.ctx.strokeStyle = "lightgray";
        this.ctx.strokeRect(
          x * this.squareSize,
          y * this.squareSize,
          this.squareSize,
          this.squareSize
        );

        this.ctx.restore();
      });
    });

    // Draw a line for the current path
    this.ctx.save();
    this.ctx.strokeStyle = "orange";
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();

    const pathMap: Record<number, GridPosition> = {};
    Object.keys(this.mapMatrix).forEach((xKey) => {
      const x = Number(xKey);
      Object.keys(this.mapMatrix[x]).forEach((yKey) => {
        const y = Number(yKey);
        const cell = this.mapMatrix[x][y];

        if (Array.isArray(cell)) {
          cell.forEach((c) => {
            if (c.path === this.currentPath) {
              pathMap[c.distance] = { row: y, col: x };
            }
          });
        }
      });
    });

    let key = 0;
    this.ctx.moveTo(
      pathMap[key].col * this.squareSize + this.squareSize / 2,
      pathMap[key].row * this.squareSize + this.squareSize / 2
    );
    key += 1;
    while (pathMap[key]) {
      this.ctx.lineTo(
        pathMap[key].col * this.squareSize + this.squareSize / 2,
        pathMap[key].row * this.squareSize + this.squareSize / 2
      );
      key += 1;
    }
    this.ctx.stroke();
    this.ctx.restore();

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

      this.ctx.fillStyle = "black";
      this.ctx.font = "20px Arial";
      this.ctx.fillText(
        `${this.currentPath}-${this.currentDistance}`,
        this.hoveredCell.col * this.squareSize + 5,
        this.hoveredCell.row * this.squareSize + 20
      );

      this.ctx.restore();
    }
  }
}
