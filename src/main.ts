import { Game } from "./classes/Game";
import { initMapBuilder } from "./mapBuilder/initMapBuilder";

// get query parameter
const builder = new URLSearchParams(window.location.search).get("builder");

if (builder) {
  initMapBuilder();
} else {
  const game = new Game();

  const renderLoop = async () => {
    game.render();
    requestAnimationFrame(renderLoop);
  };

  const updateLoop = async () => {
    game.update();
    if (game.health >= 0) {
      setTimeout(updateLoop, 1000 / 240);
    }
  };

  renderLoop();
  updateLoop();
}
