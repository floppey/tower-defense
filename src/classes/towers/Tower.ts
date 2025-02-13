import { Buff } from "../../constants/buffs";
import { Debuff } from "../../constants/debuffs";
import {
  prices,
  TowerStats,
  towerStats,
  TowerType,
} from "../../constants/towers";
import { Coordinates, GridPosition } from "../../types/types";
import { getDistanceBetweenGridPositions } from "../../util/getDistanceBetweenGridPositions";
import { getTowerStat } from "../../util/getTowerStat";
import { Entity } from "../Entity";
import { Game } from "../Game";
import Monster from "../monsters/Monster";
import { Arrow } from "../projectiles/Arrow";

export default class Tower extends Entity {
  game: Game;
  gridPosition: GridPosition;
  range: number = 4;
  damage: number = 60;
  baseDamage: number = 60;
  baseRange: number = 4;
  attackSpeed: number = 0.5;
  lastAttackTime: number = Date.now();
  placed: boolean = false;
  type: TowerType = "basic";
  multiTarget: boolean = false;
  splash: number | null = null;
  debuffs: Debuff[] | null = null;
  #towerBuffs: Buff[] = [];
  #level: number = 1;

  constructor(game: Game, gridPosition: GridPosition, type: TowerType) {
    super();
    this.type = type;
    const stats = towerStats[this.type];
    this.game = game;
    this.gridPosition = gridPosition;
    this.range = stats.range;
    this.baseRange = stats.range;
    this.damage = stats.damage;
    this.baseDamage = stats.damage;
    this.attackSpeed = stats.attackSpeed;
    this.splash = stats.splash;
    if (stats.debuff)
      this.debuffs = [
        {
          type: stats.debuff,
          duration: (stats.debuffDuration ?? 1) * this.game.gameSpeed,
        },
      ];
  }

  getImage() {
    let images = [this.game.images[`tower-${this.type}`]];
    if (this.type === "lightning") {
      images = [
        this.game.images[`tower-${this.type}`],
        this.game.images[`tower-${this.type}-2`],
      ];
    } else if (this.type === "support-damage") {
      images = [
        this.game.images[`tower-${this.type}`],
        this.game.images[`tower-${this.type}-2`],
      ];
    }
    // Cycle through images over 1 second
    const numberOfImages = images.length;
    const imageIndex = Math.floor(
      (Date.now() / this.game.gameSpeed) % numberOfImages
    );
    const image = images[imageIndex];

    return image;
  }

  getCanvasPosition(): Coordinates {
    const { squareSize } = this.game;
    const { col, row } = this.gridPosition;
    const x = col * squareSize;
    const y = row * squareSize;
    return { x, y };
  }

  render() {
    const { squareSize } = this.game;
    const { x, y } = this.getCanvasPosition();

    const image = this.getImage();
    try {
      this.game.ctx.drawImage(image, x, y, squareSize, squareSize);
    } catch (e) {
      console.error(e);
      if (this.game.debug) {
        alert(`Error rendering tower ${image}: ${e}`);
      }
    }
  }

  update() {
    this.attack();
  }

  monsterIsValidTarget(monster: Monster) {
    if (!monster.gridPosition || !monster.isAlive()) {
      return false;
    }

    return (
      getDistanceBetweenGridPositions(
        this.gridPosition,
        monster.gridPosition
      ) <= this.range
    );
  }

  getTargetInRange(): Monster | undefined {
    return this.getTargetsInRange()[0];
  }

  getTargetsInRange(): Monster[] {
    const { monsters } = this.game.level;

    return (
      monsters.filter((monster) => {
        return this.monsterIsValidTarget(monster);
      }) ?? []
    );
  }

  canAttack() {
    const currentTime = Date.now();
    const timeSinceLastAttack = currentTime - this.lastAttackTime;
    return timeSinceLastAttack > this.game.gameSpeed / this.attackSpeed;
  }

  attack() {
    const currentTime = Date.now();

    if (this.canAttack()) {
      const target = this.getTargetInRange();
      if (target) {
        this.game.projectiles.push(
          new Arrow({
            game: this.game,
            target,
            position: this.game.convertGridPositionToCoordinates(
              this.gridPosition
            ),
            damage: this.damage,
            speed: this.game.gameSpeed / 4,
            debuffs: this.debuffs,
            splash: this.splash,
            tower: this,
          })
        );
        // Add a random delay to the next attack
        this.lastAttackTime =
          currentTime +
          (this.attackSpeed * (Math.random() * 0.025) - 0.0125) *
            this.game.gameSpeed;
      }
    }
  }

  onSell() {
    this.game.money += prices[this.type] / 2;
  }

  addBuff(buff: Buff) {
    this.towerBuffs = [...this.towerBuffs, buff];
  }

  removeBuff(buff: Buff) {
    this.towerBuffs = this.towerBuffs.filter(
      (tb) => tb.type !== buff.type && tb.origin !== buff.origin
    );
  }

  get towerBuffs() {
    return this.#towerBuffs;
  }

  set towerBuffs(buffs: Buff[]) {
    this.#towerBuffs = buffs;
    let rangeMultiplier = 1;
    let damageMultiplier = 1;
    this.#towerBuffs.forEach((buff) => {
      if (buff.type === "range") {
        rangeMultiplier += buff.value;
      } else if (buff.type === "damage") {
        damageMultiplier += buff.value;
      }
    });
    this.damage = this.baseDamage * damageMultiplier;
    this.range = this.baseRange * rangeMultiplier;
  }

  get level() {
    return this.#level;
  }
  set level(level: number) {
    this.#level = level;
    this.baseDamage = Number(getTowerStat(this.type, "damage", level));
    this.baseRange = Number(getTowerStat(this.type, "range", level));
    this.attackSpeed = Number(getTowerStat(this.type, "attackSpeed", level));
    const splash = getTowerStat(this.type, "splash", level);
    this.splash = typeof splash === "number" ? splash : null;

    // Reapply buffs
    this.towerBuffs = this.towerBuffs;
  }
}
