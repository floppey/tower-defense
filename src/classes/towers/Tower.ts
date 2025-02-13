import { Buff } from "../../constants/buffs";
import { Debuff } from "../../constants/debuffs";
import { prices, towerStats, TowerType } from "../../constants/towers";
import { Coordinates, GridPosition } from "../../types/types";
import { getDistanceBetweenGridPositions } from "../../util/getDistanceBetweenGridPositions";
import { getTowerStat } from "../../util/getTowerStat";
import { Entity } from "../Entity";
import { Game } from "../Game";
import Monster from "../monsters/Monster";
import { Arrow } from "../projectiles/Arrow";
import { Projectile } from "../projectiles/Projectile";

export default class Tower extends Entity {
  game: Game;
  gridPosition: GridPosition;
  range: number = 4;
  damage: number = 60;
  baseDamage: number = 60;
  baseRange: number = 4;
  attackSpeed: number = 0.5;
  projectileSpeed: number;
  lastAttackTime: number = Date.now();
  lastUpdate: number = Date.now();
  placed: boolean = false;
  type: TowerType = "basic";
  multiTarget: boolean = false;
  splash: number | null = null;
  debuffs: Debuff[] | null = null;
  #towerBuffs: Buff[] = [];
  #level: number = 1;
  Projectile: typeof Projectile = Arrow;

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
    this.projectileSpeed = this.game.gameSpeed / 4;
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

    // Draw level icon
    if (this.level > 1) {
      // rainbow colors as hex codes
      const colors = [
        "#ff0000",
        "#ff4000",
        "#ff7f00",
        "#ffbf00",
        "#ffff00",
        "#bfff00",
        "#7fff00",
        "#40ff00",
        "#00ff00",
        "#00ff40",
        "#00ff7f",
        "#00ffbf",
        "#00ffff",
        "#00bfff",
        "#007fff",
        "#0040ff",
        "#0000ff",
        "#4000ff",
        "#7f00ff",
        "#bf00ff",
        "#ff00ff",
      ];
      const outOfBounds = this.level > colors.length + 1;
      this.game.ctx.fillStyle = outOfBounds ? "#000" : colors[this.level - 2];
      // Draw a circle
      this.game.ctx.beginPath();
      this.game.ctx.arc(x + squareSize - 10, y + 10, 8, 0, 2 * Math.PI);
      this.game.ctx.fill();
      // Draw level number
      this.game.ctx.fillStyle = outOfBounds ? "#FFF" : "#000";
      this.game.ctx.font = "10px Arial";
      this.game.ctx.textAlign = "center";
      this.game.ctx.fillText(
        this.level.toString(),
        x + squareSize - 10,
        y + 10
      );
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
    const { monsters } = this.game.level;

    return (
      monsters.find((monster) => {
        return this.monsterIsValidTarget(monster);
      }) ?? undefined
    );
  }

  getTargetsInRange(): Monster[] {
    const { monsters } = this.game.level;

    return (
      monsters.filter((monster) => {
        return this.monsterIsValidTarget(monster);
      }) ?? []
    );
  }

  getTargets(): Monster[] {
    if (this.multiTarget) {
      return this.getTargetsInRange();
    }
    const target = this.getTargetInRange();
    return target ? [target] : [];
  }

  canAttack() {
    const currentTime = Date.now();
    const timeSinceLastAttack = currentTime - this.lastAttackTime;
    return timeSinceLastAttack > this.game.gameSpeed / this.attackSpeed;
  }

  getDamage() {
    return this.damage;
  }

  attack() {
    const currentTime = Date.now();

    if (this.canAttack()) {
      const targets = this.getTargets();
      if (targets.length > 0) {
        const timeSinceLastUpdate = currentTime - this.lastUpdate;
        const attacksInThisFrame = Math.ceil(
          timeSinceLastUpdate / (this.game.gameSpeed / this.attackSpeed)
        );
        targets.forEach((target) => {
          for (let i = 0; i < attacksInThisFrame; i++) {
            this.game.projectiles.push(
              new this.Projectile({
                game: this.game,
                target,
                position: this.game.convertGridPositionToCoordinates(
                  this.gridPosition
                ),
                damage: this.getDamage(),
                speed: this.projectileSpeed,
                debuffs: this.debuffs,
                splash: this.splash,
                tower: this,
              })
            );
          }
        });
        // Add a random delay to the next attack
        this.lastAttackTime =
          currentTime +
          (this.attackSpeed * (Math.random() * 0.025) - 0.0125) *
            this.game.gameSpeed;
      }
    }
    this.lastUpdate = currentTime;
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
