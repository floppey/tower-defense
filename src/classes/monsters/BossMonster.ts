import Monster, { MonsterConstructor } from "./Monster";

export default class BossMonster extends Monster {
  constructor({ game, ...rest }: MonsterConstructor) {
    super({ game, ...rest });
    this.monsterSize = this.game.squareSize;
  }
}
