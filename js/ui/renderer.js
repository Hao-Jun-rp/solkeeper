export function renderGameState(state) {
  // Show game screen, hide start screen
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");
  document.getElementById("hud-status").classList.remove("hidden");

  // Update Top HUD
  document.getElementById("hud-location").textContent = state.location;
  document.getElementById("hud-sol").textContent = `${state.sol} / ${state.maxSols}`;
  document.getElementById("hud-power").textContent = state.powerAvailable;

  // Update Event & Science Banner
  const banner = document.getElementById("event-banner");
  banner.classList.toggle("danger", Boolean(state.activeEvent.isDanger));
  document.getElementById("event-title").textContent = state.activeEvent.title;
  document.getElementById("event-desc").textContent = state.activeEvent.description;
  document.getElementById("event-fact").textContent = state.activeEvent.nasaFact;

  // Update 4 Resource Progress Bars
  updateBar("oxygen", state.resources.oxygen);
  updateBar("water", state.resources.water);
  updateBar("food", state.resources.food);
  updateBar("shielding", state.resources.shielding);

  // Show Victory or After-Action Failure Modal if mission ended
  const modal = document.getElementById("outcome-modal");
  if (state.status === "WON" || state.status === "LOST") {
    document.getElementById("modal-title").textContent =
      state.status === "WON" ? "🎉 Mission Accomplished!" : "⚠️ Mission Aborted — Engineering Review";
    document.getElementById("modal-body").textContent = state.outcomeMessage;
    document.getElementById("modal-science").textContent = state.outcomeScience;
    modal.classList.remove("hidden");
  } else {
    modal.classList.add("hidden");
  }
}

function updateBar(key, value) {
  document.getElementById(`val-${key}`).textContent = `${value}%`;
  const bar = document.getElementById(`bar-${key}`);
  bar.style.width = `${value}%`;
  bar.classList.remove("warn", "danger");
  if (value <= 25) bar.classList.add("danger");
  else if (value <= 50) bar.classList.add("warn");
}