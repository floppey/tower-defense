export type Coordinates = { x: number; y: number };
export type GridPosition = { row: number; col: number };
export type Direction = "up" | "down" | "left" | "right" | "none";

export type Step = {
  path: string;
  distance: number;
};
export type Map = Record<number, Record<number, string | Step[]>>;
