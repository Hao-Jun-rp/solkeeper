import { loadSolarFlareArchive } from "./simulation/nasaData.js";
import { createInitialState, advanceSol } from "./simulation/engine.js";
import { renderGameState } from "./ui/renderer.js";

let gameState = null;
let solarFlareCache = [];

const sliders = {
  life: document.getElementById("slider-life"),
  greenhouse: document.getElementById("slider-greenhouse"),
  shielding: document.getElementById("slider-shielding")
};

function syncSliders(changedKey) {
  if (!gameState) return;
  const maxPower = gameState.powerAvailable;

  let life = Number(sliders.life.value);
  let greenhouse = Number(sliders.greenhouse.value);
  let shielding = Number(sliders.shielding.value);

  // Prevent total allocated power from exceeding available power
  const total = life + greenhouse + shielding;
  if (total > maxPower) {
    const excess = total - maxPower;
    if (changedKey === "life") sliders.life.value = Math.max(0, life - excess);
    if (changedKey === "greenhouse") sliders.greenhouse.value = Math.max(0, greenhouse - excess);
    if (changedKey === "shielding") sliders.shielding.value = Math.max(0, shielding - excess);
  }

  const finalTotal =
    Number(sliders.life.value) + Number(sliders.greenhouse.value) + Number(sliders.shielding.value);

  document.getElementById("lbl-life").textContent = sliders.life.value;
  document.getElementById("lbl-greenhouse").textContent = sliders.greenhouse.value;
  document.getElementById("lbl-shielding").textContent = sliders.shielding.value;
  document.getElementById("power-remaining").textContent = maxPower - finalTotal;
}

async function startMission(presetKey) {
  solarFlareCache = await loadSolarFlareArchive();
  gameState = createInitialState(presetKey);
  sliders.life.value = 30;
  sliders.greenhouse.value = 30;
  sliders.shielding.value = 30;
  syncSliders();
  renderGameState(gameState);
}

// Event Listeners
document.getElementById("btn-start-mars").addEventListener("click", () => startMission("mars"));
document.getElementById("btn-start-moon").addEventListener("click", () => startMission("moon"));

Object.entries(sliders).forEach(([key, el]) => {
  el.addEventListener("input", () => syncSliders(key));
});

document.getElementById("btn-next-sol").addEventListener("click", () => {
  if (!gameState || gameState.status !== "ACTIVE") return;

  const allocations = {
    lifeSupport: Number(sliders.life.value),
    greenhouse: Number(sliders.greenhouse.value),
    shielding: Number(sliders.shielding.value)
  };

  gameState = advanceSol(gameState, allocations, solarFlareCache);
  syncSliders();
  renderGameState(gameState);
});

document.getElementById("btn-restart").addEventListener("click", () => {
  document.getElementById("outcome-modal").classList.add("hidden");
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("hud-status").classList.add("hidden");
  document.getElementById("start-screen").classList.remove("hidden");
});