import { TowerType } from "../../types/types";
import Tower from "./Tower";

export class ArrowTower extends Tower {
  range: number = 5;
  damage: number = 25;
  attackSpeed: number = 2;
  type: TowerType = "arrow";
}
