import { Game } from "./classes/Game";

const game = new Game();

const renderLoop = async () => {
  game.render();
  requestAnimationFrame(renderLoop);
};

const updateLoop = async () => {
  game.update();
  setTimeout(updateLoop, 1000 / 60);
};

renderLoop();
updateLoop();
