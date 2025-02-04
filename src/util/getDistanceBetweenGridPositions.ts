import { GridPosition } from "../types/types";

export const getDistanceBetweenGridPositions = (
  gp1: GridPosition,
  gp2: GridPosition
) => {
  const distance = Math.sqrt(
    Math.pow(gp1.col - gp2.col, 2) + Math.pow(gp1.row - gp2.row, 2)
  );
  return Math.abs(distance);
};
