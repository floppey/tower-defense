import { Game } from "../classes/Game";
import { prices, towerStats, towerTypes } from "../constants/towers";

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
      <span id="money" class="money">${game.money.toLocaleString(
        "en-US"
      )}</span>
    </div>
    <div class="toolbar-item">
      <span>❤️: </span>
      <span id="health">${game.health}</span>
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
  const automode = document.createElement("label");
  automode.innerHTML = `
    <input type="checkbox" id="automode" />
    <span>Auto mode</span>
  `;
  toolbarTop.appendChild(automode);
  const speedLabel = document.createElement("span");
  speedLabel.innerHTML = "Speed: ";
  toolbarTop.appendChild(speedLabel);
  [0.25, 0.5, 1, 2, 5].forEach((speed) => {
    const speedButton = document.createElement("button");
    speedButton.innerHTML = `x${speed}`;
    speedButton.addEventListener("click", () => {
      game.gameSpeed = 1000 / speed;
    });
    toolbarTop.appendChild(speedButton);
  });
  document.body.insertBefore(toolbarTop, document.body.firstChild);

  const toolbarBottom = document.createElement("div");
  toolbarBottom.id = "toolbar-bottom";

  towerTypes.forEach((tower) => {
    const towerButton = document.createElement("button");
    towerButton.innerHTML = `
    <img src="assets/tower-${tower}.png" alt="${tower} tower" />
    <span>${tower} tower - <span class="price">${prices[tower].toLocaleString(
      "en-US"
    )}🪙</span></span>
    `;
    towerButton.addEventListener("click", () => {
      game.newTower = tower;
    });
    toolbarBottom.appendChild(towerButton);
  });

  document.body.appendChild(toolbarBottom);

  const infoPanel = document.createElement("div");
  infoPanel.id = "info-panel";
  infoPanel.innerHTML = `
  <details>
  <summary>How to play</summary>
  <h2>Goal</h2>
  <p>Defend your base from waves of monsters by building towers. The monsters move from the blue square(s) to the red square(s)</p>
  <h2>Adding towers</h2>
  <p>
    Use the toolbar at the bottom to select a tower type. Click on an empty square on the map to add a tower.
  </p>
  <h2>Selling towers</h2>
  <p>
    Right-click on a tower to sell it for half the price.
  </p>
  <h2>Starting a wave</h2>
  <p>
    Click the "Start Wave" button to start a new wave of monsters.
  </p>
  <h2>Auto mode</h2>
  <p>
    When auto mode is enabled, the game will automatically start new waves when the previous wave is defeated.
  </p>
  
  </details>
  
  `;
  document.body.appendChild(infoPanel);

  const towerTable = document.createElement("div");
  towerTable.id = "tower-table";
  towerTable.innerHTML = `
  <details>
  <summary>Tower Stats</summary>
  <h2>Towers:</h2>
  <i>Speed is number of attacks per second. Range and splash values are in number of squares. 
  </i>
  <table>
  <thead>
  
  <tr>
    <th>Type</th>
    <th>Damage</th>
    <th>Speed</th>
    <th>DPS</th>
    <th>Range</th>
    <th>Splash</th>
    <th>Debuff</th>
    <th>Special</th>
  </tr>
  </thead>
  <tbody>
  ${towerTypes
    .map((tower) => {
      const stats = towerStats[tower];
      return `<tr>
      <td><img src="assets/tower-${tower}.png" alt="${tower} tower" /></td>
      <td>${stats.damage}</td>
      <td>${stats.attackSpeed}</td>
      <td>${stats.damage * stats.attackSpeed}</td>
      <td>${stats.range}</td>
      <td>${stats.splash || "❌"}</td>
      <td>${
        stats.debuff ? `${stats.debuff} (${stats.debuffDuration}s)` : "❌"
      }</td>
      <td>${stats.special ?? ""}</td>
      </tr>`;
    })
    .join("")}
  </tbody>
  </table>
  </details>
  `;

  document.body.appendChild(towerTable);
};
