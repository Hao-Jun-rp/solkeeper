import { MISSION_PRESETS, HAZARD_EVENTS } from "./nasaData.js";

export function createInitialState(presetKey = "mars") {
  const preset = MISSION_PRESETS[presetKey] || MISSION_PRESETS.mars;
  return {
    presetKey,
    location: preset.name,
    sol: 1,
    maxSols: 10,
    powerAvailable: preset.basePower,
    resources: { ...preset.initialResources },
    activeEvent: {
      title: "Mission Touchdown Successful",
      description: `Welcome to ${preset.name}. Allocate your ${preset.basePower} kW power budget wisely!`,
      nasaFact: "Tip: Every system competes for energy—leaving Radiation Shielding too low puts the crew at risk during solar flares.",
      isDanger: false
    },
    status: "ACTIVE", // "ACTIVE" | "WON" | "LOST"
    outcomeMessage: "",
    outcomeScience: preset.victoryFact
  };
}

function clamp(val) {
  return Math.max(0, Math.min(100, Math.round(val)));
}

export function advanceSol(currentState, allocations, solarFlares = []) {
  const { lifeSupport, greenhouse, shielding } = allocations;
  const res = { ...currentState.resources };
  const preset = MISSION_PRESETS[currentState.presetKey];

  // 1. Base daily consumption & power trade-offs
  // Life support converts power + water into oxygen
  res.oxygen += lifeSupport * 0.45 - 12;
  res.water += lifeSupport * 0.35 - 10 - greenhouse * 0.12; // Greenhouse consumes water!

  // CSA "Water-to-Everything" rule: low water slows down crop growth
  const waterPenalty = res.water < 30 ? 0.5 : 1.0;
  res.food += greenhouse * 0.5 * waterPenalty - 11;

  // Radiation shielding decays naturally unless powered
  res.shielding += shielding * 0.45 - 11;

  // 2. Pick a space weather or CSA event (35% chance of real DONKI Solar Flare)
  let nextEvent;
  let nextPower = preset.basePower;

  if (Math.random() < 0.35 && solarFlares.length > 0) {
    const flare = solarFlares[Math.floor(Math.random() * solarFlares.length)];
    const flareDamage = shielding >= 35 ? -6 : -22;
    res.shielding += flareDamage;
    nextEvent = {
      title: `☀️ NASA DONKI Alert: Class ${flare.classType} Solar Flare!`,
      description:
        shielding >= 35
          ? "Your active magnetic shielding absorbed most of the radiation burst!"
          : "Shielding power was too low! Radiation levels spiked inside the habitat.",
      nasaFact: `Live NASA DONKI Telemetry: Flare ID ${flare.flrID} detected at ${flare.beginTime}.`,
      isDanger: true
    };
  } else {
    const hazard = HAZARD_EVENTS[Math.floor(Math.random() * HAZARD_EVENTS.length)];
    res.oxygen += hazard.effects.oxygen;
    res.water += hazard.effects.water;
    res.food += hazard.effects.food;
    res.shielding += hazard.effects.shielding;
    if (hazard.powerOverride) nextPower = hazard.powerOverride;

    nextEvent = {
      title: hazard.title,
      description: hazard.description,
      nasaFact: hazard.nasaFact,
      isDanger: hazard.id !== "nominal"
    };
  }

  // Clamp all values between 0 and 100
  res.oxygen = clamp(res.oxygen);
  res.water = clamp(res.water);
  res.food = clamp(res.food);
  res.shielding = clamp(res.shielding);

  // 3. Check Win / Loss conditions & build constructive After-Action Report
  let status = "ACTIVE";
  let outcomeMessage = "";

  if (res.oxygen <= 0) {
    status = "LOST";
    outcomeMessage =
      "After-Action Engineering Report: Cabin Oxygen depleted! Next time, route more power to Life Support & Water Recycling—or watch out for crumbs clogging the air filters.";
  } else if (res.water <= 0) {
    status = "LOST";
    outcomeMessage =
      "After-Action Engineering Report: Water reserves ran dry! Remember: your Hydroponic Greenhouse uses water to grow crops, so balance Greenhouse power with Life Support recycling.";
  } else if (res.food <= 0) {
    status = "LOST";
    outcomeMessage =
      "After-Action Engineering Report: Crew food supplies ran out! Keep your Hydroponic Greenhouse powered so astronauts have fresh crops for energy and morale.";
  } else if (res.shielding <= 0) {
    status = "LOST";
    outcomeMessage =
      "After-Action Engineering Report: Radiation Shielding collapsed during space weather! Keep at least 30–35 kW in Active Shielding to protect against NASA DONKI solar flares.";
  } else if (currentState.sol >= currentState.maxSols) {
    status = "WON";
    outcomeMessage = `Outstanding work, Commander! Your outpost survived all ${currentState.maxSols} Sols on ${currentState.location} with every system intact.`;
  }

  return {
    ...currentState,
    sol: status === "ACTIVE" ? currentState.sol + 1 : currentState.sol,
    powerAvailable: nextPower,
    resources: res,
    activeEvent: nextEvent,
    status,
    outcomeMessage
  };
}