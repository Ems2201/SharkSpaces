# 🦈 Shark Space – NASA AI Ocean Explorer

Shark Space is an interactive application developed to explore and visualize ocean environmental and shark behavioral data based on NASA partner missions and satellites such as PACE, MODIS-Aqua, and SWOT. The project combines data science, interactive visualization, and gamification to make ocean studies more accessible and educational.

## 🌍 About the Project

Shark Space allows users to explore 20 strategic ocean regions monitored by NASA satellites and partner agencies. Each point on the map represents a region with real and simulated data about:

* Sea Surface Temperature (SST)
* Sea Surface Height (SSH)
* Phytoplankton Abundance
* Simulated acoustic detection of marine species
* Acceleration and motion data (simulating bio-logging tags)

The application also includes an educational, multilingual mode that translates species names and informational text according to the user’s language.

## 🚀 Technologies Used

**Category — Tools**

* **Frontend:** React + Vite
* **UI/UX:** shadcn/ui, TailwindCSS, Lucide Icons
* **Internationalization:** i18next
* **Data Visualization:** Recharts
* **NASA APIs Integrated:** PACE, MODIS-Aqua, SWOT
* **Database:** Supabase
* **Hosting:** Netlify (static site)
* **Other:** Sensor simulation (audio, temperature, acceleration)
* **🛰️ NASA API Integration**

## 🛰️ Integrated NASA Missions

The application consumes data from the following missions:

* **PACE (2024–present)** — Observations of phytoplankton, aerosols, and ocean ecosystems.
* **MODIS-Aqua (2002–present)** — Measurements of temperature and water color for detecting marine productivity.
* **SWOT (2022–present)** — Ocean surface elevation and sea level variability data.

This information is accessed via REST integration (implemented in the backend with Node.js/Express), processed, and dynamically displayed on the dashboard.

## 🧠 Key Features

* **Ocean Region Exploration** — Visualize up to 20 regions with environmental and satellite data.
* **Species Detection Simulation** — The system generates randomized detections of marine sounds and movements.
* **Multilingual Support** — Automatic translation of species names and informational text.
* **NASA API Integration** — Displays real and simulated satellite data.
* **Interactive Charts & Maps** — Real-time visual analysis of ocean parameters.
* **Audio Simulation** — Recreates sound-detection events without relying on a real microphone.
* **Dynamic Sidebar** — Shows details when clicking points on the map.

## 💻 Installation & Running

### 🔧 Requirements

Before starting, make sure you have installed:

* Node.js (version 18+)
* npm (usually included with Node)
* Code editor (e.g., VS Code)

### 🪄 Step-by-step

1. Clone the repository

```bash
git clone https://github.com/Ems2201/Shark-Spaces.git
```

2. Enter the project folder

```bash
cd Shark-Spaces
```

3. Install dependencies

```bash
npm install
```

4. Start the development server

```bash
npm run dev
```

The application will run locally at:
👉 [http://localhost:5173](http://localhost:5173)

**Developed by:** Erick Paes, Guilherme Pinheiro, Leonardo Cassillo, Pedro Souza

🌐 Educational project inspired by NASA Ocean Missions & Marine Ecology Data Visualization

## ⚖️ License

This project is distributed under the MIT license. You may use, modify, and redistribute it freely, provided you retain the credits.

