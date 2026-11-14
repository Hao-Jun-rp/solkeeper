🚀 Junior Astronaut Mission Trainer (2026 NASA Space Apps)

🔗 Live app: [Add your GitHub Pages / Vercel / Netlify link here]

A lightweight, zero-backend web application built with Vanilla HTML5, CSS3, and ES6+ JavaScript for the 2026 NASA Space Apps Challenge (Build a Junior Astronaut Mission Trainer). Each teammate owns an isolated set of files (ui/ vs. simulation/) so you can build in parallel without Git merge conflicts; this README explains how the whole thing fits together and how to run it yourself.

1. See it live, or run it locally

Just want to play it? Visit [Your Live App URL] — no login, installation, or server needed. Kids (ages 7–12) and judges can launch a Lunar or Martian outpost mission directly in their browser.

Want to run it on your own machine? Keep reading below.

2. One-time setup (do this once on your laptop)

You only need Git and any modern web browser (Chrome, Edge, Safari, Firefox). No Python, Node, or database installation is required.

# 1. Get the code
git clone https://github.com/Hao-Jun-rp/junior-astronaut-trainer.git
cd junior-astronaut-trainer


3. Run the app

Because this project uses ES6 JavaScript modules (type="module"), open it through a local static server rather than double-clicking index.html:

Option A (VS Code — Easiest): Install the Live Server extension, right-click index.html, and click "Open with Live Server".

Option B (Python one-liner):

python -m http.server 8000


Then open http://localhost:8000 in your browser.

Option C (Node one-liner):

npx serve .


Try Select Outpost (Mars or Moon) → Adjust Power Sliders → Advance Sol — the full 10-Sol simulation loop works end-to-end, including space weather alerts and After-Action Engineering Reports.

4. What the app does & NASA scientific grounding

Junior Astronaut Mission Trainer is an interactive outpost simulator teaching students ages 7–12 the real engineering trade-offs of living on the Moon and Mars. Instead of trivia, players act as Mission Commanders balancing Power, Life Support (Oxygen & Water), Food, and Radiation Shielding across a 10-Sol mission:

Tangible Trade-Offs: Allocating power to greenhouses or oxygen recyclers reduces energy available for active radiation shielding during solar storms.

Dynamic Space Weather: Randomized hazards (Martian global dust storms, solar particle events, micrometeorites) force players to adapt their resource budgets on the fly.

Constructive Failure Reports: If a resource hits 0%, players receive a kid-friendly engineering breakdown explaining the physics behind what failed and how to improve on their next attempt.

Traceable NASA Datasets (js/simulation/nasaData.js)

All environmental parameters and hazard probabilities are grounded in real NASA mission data:

Mars Surface (Jezero / Gale Crater): Derived from NASA Mars Science Laboratory (Curiosity) — REMS (temperature swings, dust opacity drops in solar efficiency) and RAD (surface radiation baselines).

Lunar South Pole (Shackleton Crater): Derived from NASA Lunar Reconnaissance Orbiter (LRO) — Diviner thermal illumination cycles and battery storage trade-offs.

Closed-Loop Life Support: Derived from NASA ECLSS (Environmental Control and Life Support System) water/oxygen recovery ratios.

5. Who owns what (folder map)

junior-astronaut-trainer/
├── index.html                  ← Hao Jun (Mission Control HUD, sliders & modals)
├── css/
│   └── theme.css               ← Hao Jun (Design system variables, cards & bars)
├── js/
│   ├── main.js                 ← SHARED  (Wires HTML buttons/sliders to engine)
│   ├── ui/
│   │   └── renderer.js         ← Hao Jun (Updates resource bars, alerts & modals)
│   └── simulation/
│       ├── engine.js           ← Teammate (10-Sol math, hazards & failure reports)
│       └── nasaData.js         ← Teammate (Curated NASA mission stats & citations)
└── README.md                   ← Documentation & NASA data sources


Work inside your own folder. js/ui/ only handles DOM rendering, while js/simulation/ only handles pure JavaScript math and NASA data.

6. Shared State Contract (engine.js → renderer.js)

Both folders communicate through one plain JavaScript object returned by advanceSol() so UI and simulation logic can be developed independently:

{
  outpostKey: "mars",
  outpostName: "Mars — Jezero Crater",
  sol: 3,
  maxSols: 10,
  powerAvailable: 100,
  resources: {
    oxygen: 85,     // 0 to 100%
    water: 75,      // 0 to 100%
    food: 80,       // 0 to 100%
    shielding: 70   // 0 to 100%
  },
  event: {
    title: "Martian Dust Storm",
    description: "Dust is blocking sunlight! Solar power dropped to 60 units.",
    nasaFact: "NASA's Curiosity rover measured dust storms cutting solar energy by over 60%.",
    severity: "warning" // "normal" | "warning" | "danger"
  },
  status: "ACTIVE", // "ACTIVE" | "WON" | "LOST"
  failureReport: null
}


7. Deployment (30 Seconds on GitHub Pages)

Push your code to the main branch on GitHub.

Go to your repository Settings → Pages.

Under Build and deployment, select Deploy from a branch → main → / (root) and click Save.

Your live HTTPS URL (https://hao-jun-rp.github.io/junior-astronaut-trainer/) goes live within ~60 seconds.

8. The golden rules (keeps merges smooth)

Only edit your own files (index.html, css/, js/ui/ vs. js/simulation/).

Coordinate before editing js/main.js. Keep main.js thin—just event listeners connecting renderer.js and engine.js.

Always start work on a fresh branch:

git checkout main
git pull origin main
git checkout -b feature/<your-feature>


Use the design system. Style with CSS variables in css/theme.css (var(--color-primary), var(--color-danger)) instead of hard-coding hex colors.

9. Daily flow (memorise this)

pull main  →  make a branch  →  build in your folder  →  commit  →  push  →  open a Pull Request


Happy building, Commander! 🚀