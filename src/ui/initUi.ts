import { Game } from "../classes/Game";

export const initUi = (game: Game) => {
  const toolbarTop = document.createElement("div");
  toolbarTop.id = "toolbar-top";

  const startWaveButton = document.createElement("button");
  startWaveButton.id = "start-wave";
  startWaveButton.innerHTML = "Start Wave";
  startWaveButton.addEventListener("click", () => {
    game.startWave();
  });

  toolbarTop.innerHTML = `
    <div class="toolbar-item">
      <span>🪙: </span>
      <span id="money">100</span>
    </div>
    <div class="toolbar-item">
      <span>❤️: </span>
      <span id="health">10</span>
    </div>
    <div class="toolbar-item">
      <span>🌊: </span>
      <span id="wave">0</span>
    </div>
    <div class="toolbar-item">
      <span>👿: </span>
      <span id="monsters">0</span>
    </div>
     <div class="toolbar-item">
      <span>💀: </span>
      <span id="kills">0</span>
    </div>
  `;
  toolbarTop.appendChild(startWaveButton);
  document.body.insertBefore(toolbarTop, document.body.firstChild);
};
