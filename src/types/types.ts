export type Coordinates = { x: number; y: number };
export type GridPosition = { row: number; col: number };
export type Direction = "up" | "down" | "left" | "right" | "none";
export type TowerType =
  | "basic"
  | "arrow"
  | "cannon"
  | "mage"
  | "ice"
  | "fire"
  | "lightning"
  | "poison";
export type DebuffType = "freeze" | "poison";
export interface Debuff {
  type: DebuffType;
  duration: number;
}
export type Step = {
  path: string;
  distance: number;
};
export type Map = Record<number, Record<number, string | Step[]>>;
