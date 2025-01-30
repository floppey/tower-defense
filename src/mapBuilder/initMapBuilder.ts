import { MapBuilder } from "./classes/MapBuilder";

export const initMapBuilder = () => {
  const width = Number(
    prompt("Enter the width of map (e.g. 15):")?.replace(/\D/g, "")
  );
  const height = Number(
    prompt("Enter the height of map (e.g. 15):")?.replace(/\D/g, "")
  );

  const mapBuilder = new MapBuilder(width, height);

  const renderLoop = async () => {
    mapBuilder.render();
    requestAnimationFrame(renderLoop);
  };

  renderLoop();
};
