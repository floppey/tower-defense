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
      requestAnimationFrame(updateLoop);
    }
  };

  renderLoop();
  updateLoop();
}
