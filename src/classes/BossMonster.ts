import { Game } from "./Game";
import Monster from "./Monster";

export default class BossMonster extends Monster {
  constructor({
    game,
    health,
    speed,
    damage,
    reward,
  }: {
    game: Game;
    health: number;
    speed: number;
    damage: number;
    reward: number;
  }) {
    super({ game, health, speed, damage, reward });
    this.monsterSize = this.game.squareSize / 2;
  }

  render() {
    const coords = this.getCanvasPosition();
    if (!coords) {
      return;
    }
    const { ctx } = this.game;
    const { x, y } = coords;

    ctx.save();

    ctx.fillStyle = "red";
    ctx.fillRect(x, y, this.monsterSize, this.monsterSize);
    ctx.fillRect(x, y - 10, this.monsterSize, 5);
    if (this.debuffs.some((debuff) => debuff.type === "freeze")) {
      ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
      ctx.fillRect(x, y, this.monsterSize, this.monsterSize);
    }
    if (this.debuffs.some((debuff) => debuff.type === "poison")) {
      ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
      ctx.fillRect(x, y, this.monsterSize, this.monsterSize);
    }
    // Draw health bar
    ctx.fillStyle = "red";
    ctx.fillStyle = "green";
    ctx.fillRect(
      x,
      y - 10,
      (this.monsterSize * this.health) / this.maxHealth,
      5
    );
  }
}
