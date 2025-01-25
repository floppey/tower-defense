import { Game } from "./classes/Game";

const game = new Game();

const renderLoop = async () => {
  game.render();
  requestAnimationFrame(renderLoop);
};

const updateLoop = async () => {
  game.update();
  if (game.health >= 0) {
    setTimeout(updateLoop, game.gameSpeed / 60);
  }
};

renderLoop();
updateLoop();
