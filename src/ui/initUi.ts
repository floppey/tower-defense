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

  const asideRight = document.createElement("aside");
  asideRight.id = "aside-right";
  asideRight.innerHTML = `
  <h2>Controls</h2>
  <h3>Add a new tower</h3>
  <p>Click an empty square to add a new simple tower tower to the map</p>
  <h3>Upgrade a tower</h3>
  <p>Click a tower. If you have enough gold, the tower will be upgraded.</p>
  <h3>Towers</h3>
  <ul id="towers-overview">
  <li>
  <img src="assets/tower-basic.png" alt="basic tower" /><span><strong>Basic tower</strong>. Cost: 50 🪙<br/> Single target, short range, low damage, slow attackspeed, slow projectiles.</span>
  </li>
  <li>
  <img src="assets/tower-arrow.png" alt="arrow tower" /><span><strong>Arrow tower</strong>. Cost: 100 🪙<br/> Single target, medium range, low damage, medium attackspeed, medium speed projectiles.</span>
  </li>
  <li>
  <img src="assets/tower-cannon.png" alt="cannon tower" /> <span> <strong>Cannon tower</strong>. Cost: 200 🪙<br/> Splash damage, short range, high damage, very slow attackspeed, very slow projectiles.</span>
  </li>
  <!--
  <li>
   <img src="assets/tower-mage.png" alt="mage tower" /><span><strong>Mage tower</strong>. Cost: 300 🪙<br/> Single target, long range, medium damage, slow attackspeed, slow projectiles. </span>
  </li>
  -->
  <li>
  <img src="assets/tower-fire.png" alt="fire tower" /><span><strong>Fire tower</strong>. Cost: 1,000 🪙<br/> Small splash damage, medium range, high damage, fast attackspeed, fast projectiles.</span>
  </li>
  </ul>
  `;
  document.body.appendChild(asideRight);
};
