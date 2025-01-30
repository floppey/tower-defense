import { Coordinates, GridPosition } from "../../types/types";
import { MapBuilder } from "./MapBuilder";

export class MapBuilderMouseHandler {
  mousePosition: Coordinates;
  mapBuilder: MapBuilder;
  pressedKeys: string[] = [];

  constructor(mapBuilder: MapBuilder) {
    this.mousePosition = { x: 0, y: 0 };
    this.mapBuilder = mapBuilder;
    this.init();
  }

  getCellAtMousePosition(): GridPosition {
    const { x, y } = this.mousePosition;
    const { squareSize } = this.mapBuilder;
    const col = Math.floor(x / squareSize);
    const row = Math.floor(y / squareSize);

    return { row, col };
  }

  init() {
    this.mapBuilder.canvas.addEventListener("mousemove", (event) => {
      const rect = this.mapBuilder.canvas.getBoundingClientRect();
      this.mousePosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      this.mapBuilder.hoveredCell = this.getCellAtMousePosition();
    });

    this.mapBuilder.canvas.addEventListener("click", () => {
      this.handleClick();
    });

    // context menu
    this.mapBuilder.canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      const cell = this.getCellAtMousePosition();
      this.mapBuilder.mapMatrix[cell.col][cell.row] = "?";
    });

    // handle mouse wheel event
    this.mapBuilder.canvas.addEventListener("wheel", (event) => {
      if (event.deltaY < 0) {
        this.mapBuilder.currentDistance += 1;
      } else {
        this.mapBuilder.currentDistance -= 1;
        if (this.mapBuilder.currentDistance < 0) {
          this.mapBuilder.currentDistance = 0;
        }
      }
      this.mapBuilder.canvas.width =
        this.mapBuilder.width * this.mapBuilder.squareSize;
      this.mapBuilder.canvas.height =
        this.mapBuilder.height * this.mapBuilder.squareSize;
      this.mapBuilder.render();
    });

    // handle key down event
    document.addEventListener("keydown", (event) => {
      this.pressedKeys.push(event.key);
      if (event.key === "s" && this.pressedKeys.includes("Control")) {
        event.preventDefault();
        console.log(JSON.stringify(this.mapBuilder.mapMatrix));
      }
    });
    document.addEventListener("keyup", (event) => {
      this.pressedKeys = this.pressedKeys.filter((key) => key !== event.key);
    });
  }

  handleClick() {
    if (this.pressedKeys.includes("Shift")) {
      this.mapBuilder.currentPath =
        Number(this.mapBuilder.currentPath) + 1 + "";
      return;
    }

    if (this.pressedKeys.includes("Control")) {
      this.mapBuilder.currentPath =
        Math.max(1, Number(this.mapBuilder.currentPath)) - 1 + "";
      return;
    }

    const cell = this.getCellAtMousePosition();

    const matrixCell = this.mapBuilder.mapMatrix[cell.col][cell.row];
    if (typeof matrixCell === "string") {
      this.mapBuilder.mapMatrix[cell.col][cell.row] = [
        {
          distance: this.mapBuilder.currentDistance,
          path: this.mapBuilder.currentPath,
        },
      ];
    } else {
      matrixCell.push({
        distance: this.mapBuilder.currentDistance,
        path: this.mapBuilder.currentPath,
      });
    }
    this.mapBuilder.currentDistance += 1;
  }
}
