import { Game } from "./classes/Game";

const game = new Game();

const renderLoop = async () => {
  game.render();
  requestAnimationFrame(renderLoop);
};

const updateLoop = async () => {
  game.update();
  if (game.health >= 0) {
    requestAnimationFrame(updateLoop);
  }
};

renderLoop();
updateLoop();
