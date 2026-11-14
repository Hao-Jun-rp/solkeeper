const CACHE_KEY = "solkeeper_donki_flares_v1";

// Safely load optional local config.js, falling back to DEMO_KEY if not present
async function getApiKey() {
  try {
    const cfg = await import("../config.js");
    return cfg.NASA_API_KEY || "DEMO_KEY";
  } catch {
    return "DEMO_KEY";
  }
}

// Fetch real solar flares ONCE per browser session to conserve rate limits
export async function loadSolarFlareArchive() {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) return JSON.parse(cached);

  const apiKey = await getApiKey();
  const url = `https://api.nasa.gov/DONKI/FLR?startDate=2026-10-15&endDate=2026-11-15&api_key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.warn("NASA DONKI offline fallback active:", err);
  }

  // Fallback dataset modeled on real NASA DONKI flare telemetry
  return [
    { flrID: "2026-11-02T14:20:00-FLR-001", classType: "X1.4", beginTime: "2026-11-02T14:20Z" },
    { flrID: "2026-11-08T09:15:00-FLR-002", classType: "M5.2", beginTime: "2026-11-08T09:15Z" }
  ];
}

export const MISSION_PRESETS = {
  mars: {
    name: "Mars (Jezero Crater)",
    basePower: 100,
    initialResources: { oxygen: 80, water: 80, food: 75, shielding: 70 },
    victoryFact:
      "Earth Connection (CSA): The closed-loop hydroponic systems you used on Mars also help remote Arctic communities on Earth grow fresh vegetables year-round!"
  },
  moon: {
    name: "Moon (Shackleton Crater)",
    basePower: 90,
    initialResources: { oxygen: 85, water: 70, food: 80, shielding: 65 },
    victoryFact:
      "Lunar Science (NASA LRO & CSA): Surviving the Lunar South Pole requires harvesting ancient water ice from permanently shadowed craters for drinking, oxygen, and crops!"
  }
};

// Hazard deck grounded in NASA REMS/LRO & Canadian Space Agency (CSA) Food Production Toolkit
export const HAZARD_EVENTS = [
  {
    id: "dust_storm",
    title: "🌪️ Regional Dust Storm!",
    description: "Thick dust covers the solar arrays! Available power drops to 65 kW next Sol.",
    nasaFact: "NASA Curiosity REMS data shows Martian dust storms can block over 60% of sunlight reaching solar panels.",
    powerOverride: 65,
    effects: { oxygen: 0, water: 0, food: -5, shielding: 0 }
  },
  {
    id: "csa_crumbs",
    title: "🥖 CSA Alert: Crumbs in the Air Filter!",
    description: "Floating crumbs clogged the cabin vents! Oxygen efficiency drops by 12% this Sol.",
    nasaFact: "Canadian Space Agency (CSA) Food Fact: Astronauts eat tortillas instead of bread because floating crumbs can damage life-support filters!",
    powerOverride: null,
    effects: { oxygen: -12, water: 0, food: 0, shielding: 0 }
  },
  {
    id: "csa_space_cold",
    title: "🤧 CSA Alert: Space Congestion & Menu Fatigue",
    description: "Low gravity causes stuffy noses, dulling taste buds! Extra fresh crops are needed for crew morale.",
    nasaFact: "CSA Food Toolkit: Fluid shifts in space give astronauts a 'space cold,' making flavorful, fresh greenhouse plants essential for health.",
    powerOverride: null,
    effects: { oxygen: 0, water: -5, food: -10, shielding: 0 }
  },
  {
    id: "nominal",
    title: "☀️ Clear Skies & Nominal Telemetry",
    description: "Solar arrays are charging at peak efficiency. A great Sol to stockpile resources!",
    nasaFact: "NASA ECLSS closed-loop systems can recover up to 98% of cabin water on long-duration missions.",
    powerOverride: null,
    effects: { oxygen: 0, water: 0, food: 0, shielding: 0 }
  }
];