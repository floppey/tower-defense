export type Coordinates = { x: number; y: number };
export type GridPosition = { row: number; col: number };
export type Direction = "up" | "down" | "left" | "right" | "none";
export type TowerType = "basic" | "arrow" | "cannon" | "mage" | "ice" | "fire";
export type DebuffType = "freeze";
export interface Debuff {
  type: DebuffType;
  duration: number;
}
export type Map = Record<number, Record<number, number[] | string>>;
