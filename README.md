# 🚀 SolKeeper — Junior Astronaut Mission Trainer

[![Live Demo](https://img.shields.io/badge/Live_Demo-Render_Static_Site-38bdf8?style=for-the-badge)](https://solkeeper.onrender.com)
[![Challenge](https://img.shields.io/badge/NASA_Space_Apps_2026-Junior_Astronaut_Mission_Trainer-0b1021?style=for-the-badge)](https://www.spaceappschallenge.org/)

**Play Live:** https://solkeeper.onrender.com  
**Source Code:** https://github.com/Hao-Jun-rp/solkeeper

---

## 🌌 Overview
**SolKeeper** is an interactive, zero-login browser simulation built for students ages **7–12** to experience the real engineering trade-offs of managing a Lunar or Martian outpost. Rather than simplifying spaceflight into trivia, players act as Mission Commanders across a **10-Sol mission**, balancing a limited kilowatt power budget between competing life-support systems while responding to real-world space weather and astronaut nutrition hazards.

### Core Gameplay & Engineering Trade-Offs
* **Two Authentic Mission Sites:** Launch into **Mars (Jezero Crater)** or the **Moon (Shackleton Crater)**, each with distinct power budgets and environmental pressures.
* **Interconnected Resource Management:** Distribute power every Sol across **Life Support & Water Recycling**, **Hydroponic Food Production**, and **Active Radiation Shielding**. Over-allocating power to crops consumes extra water, while under-powering shielding leaves the crew exposed during solar storms.
* **Constructive After-Action Engineering Reports:** If any vital resource (Oxygen, Water, Food, or Shielding) depletes, the simulator generates a kid-friendly engineering breakdown explaining the physics behind what went wrong and how to adjust strategy on the next run.

---

## 🛰️ NASA & Space Agency Partner Data Used
* **NASA Space Weather Database (DONKI):** Fetches recent solar flare telemetry (`FLR`) from `https://api.nasa.gov/DONKI/FLR` (with `sessionStorage` caching and an offline archive fallback) to trigger radiation shielding emergencies during missions.
* **Canadian Space Agency (CSA) — Food Production on the Moon Toolkit:** Grounds the closed-loop hydroponic water-to-crop mechanics and space nutrition hazard cards (such as floating crumbs clogging air filters and microgravity "space congestion" affecting crew appetite).
* **NASA Curiosity (REMS) & Lunar Reconnaissance Orbiter (LRO):** Informs baseline environmental constraints for Martian dust storm solar-power drops and Lunar South Pole operations.

---

## 🗂️ Project Architecture
Built with zero external frameworks or build steps for instant browser accessibility:

    solkeeper/
    ├── index.html                   # Mission Control UI, resource bars & outcome modals
    ├── css/
    │   └── theme.css                # Responsive dark-space HUD styling & alert states
    └── js/
        ├── config.example.js        # Public template for optional personal NASA API key
        ├── main.js                  # Entry point, slider power-cap logic & event listeners
        ├── simulation/
        │   ├── nasaData.js          # Cached NASA DONKI API integration & CSA hazard deck
        │   └── engine.js            # 10-Sol resource simulation math & failure diagnostics
        └── ui/
            └── renderer.js          # DOM updates for progress bars, alerts & modals

---

## 💻 Running Locally
Because **SolKeeper** uses native ES6 JavaScript modules (`type="module"`), serve the root directory with any local static web server:

    git clone https://github.com/Hao-Jun-rp/solkeeper.git
    cd solkeeper
    python -m http.server 8000

Open `http://localhost:8000` in your browser. *(Optional: Copy `js/config.example.js` to `js/config.js` to add a personal key from https://api.nasa.gov/; otherwise, it defaults to `DEMO_KEY` with session caching.)*

---

## 🤖 Use of Super Intelligence (SI) Disclosure
In accordance with NASA Space Apps Challenge guidelines, generative AI (Gemini) was utilized during development to assist with scaffolding the modular Vanilla JavaScript architecture, structuring the resource trade-off formulas, and drafting project documentation. All scientific parameters and telemetry endpoints were verified against official NASA and Canadian Space Agency (CSA) challenge resources. No NASA logos or restricted branding elements are used in this application.
