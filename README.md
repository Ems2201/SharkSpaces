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

---

# 🦈 Sharks-from-Space: Bayesian Predictive Model of Feeding Hotspots

## **🌐Overview**

This project proposes a **Bayesian predictive framework** to estimate regions with a high probability of shark feeding activity (*feeding hotspots*) based on environmental and behavioral variables.
The goal is to provide a technical foundation for integrating **deep telemetry data** with **satellite-derived oceanographic information**, contributing to the identification and prediction of movement patterns and feeding behavior in large marine predators.

The simulation was entirely developed in **Python**, using the **PyMC** library for Bayesian inference and **Matplotlib** for spatial visualization.

---

## **🧩 Model Architecture**

The core of the model is a **Bayesian logistic regression**, calibrated with synthetic data that emulate real environmental conditions obtained from satellite sensors.
The probabilistic formulation aims to estimate the likelihood of a feeding event (binary variable `y = 1`) as a function of environmental and physiological variables recorded by a sensor tag.

The base equation follows:

[
P(y_i = 1) = \frac{1}{1 + e^{-(\beta_0 + \beta_T T_i + \beta_P P_i + \beta_S S_i + \beta_D D_i)}}
]

where:

* ( y_i ) — feeding event (1 = occurred, 0 = not occurred);
* ( T_i, P_i, S_i, D_i ) — environmental variables associated with observation ( i );
* ( \beta_0, \beta_T, \beta_P, \beta_S, \beta_D ) — parameters inferred via MCMC sampling in PyMC.

Inference is performed using the **NUTS (No-U-Turn Sampler)** algorithm — the standard Hamiltonian Monte Carlo method in modern Bayesian models — ensuring stable convergence and efficient sampling of the posterior space.

---

## **📈 Modeled Variables**

| Variable           | Description                   | Unit  | Source (real/synthetic)                               |
| ------------------ | ----------------------------- | ----- | ----------------------------------------------------- |
| `temp`             | Water temperature             | °C    | Derived from thermal sensors (e.g., MODIS, PACE)      |
| `plancton`         | Phytoplankton concentration   | mg/m³ | Biological proxy for prey abundance (satellite)       |
| `salinidade`       | Surface salinity              | PSU   | Measured by L-band radiometers (e.g., SMAP, Aquarius) |
| `profundidade`     | Maximum estimated depth       | m     | Animal pressure tag data                              |
| `g_event`          | Acceleration or G-force event | m/s²  | Captured by the onboard accelerometer                 |
| `temp_min`         | Minimum temperature at depth  | °C    | Internal thermal sensor from the tag                  |
| `feed_consistency` | Feeding consistency index     | 1–3   | Estimated via underwater audio (embedded AI)          |

> **Note:** In this simplified version, the model uses only the main environmental variables (`temp`, `plancton`, `salinidade`, `profundidade`) to maintain computational efficiency in Google Colab.

---

## **⚙️ Simulation Pipeline**

1. **Generation of synthetic environmental data**
   Temperature, salinity, phytoplankton, and depth fields are generated over a continuous lat-long grid, with light Gaussian noise and sinusoidal patterns simulating real ocean gradients.

2. **Creation of observation samples (surfacing points)**
   600 random points are selected from the grid, representing shark location transmissions (pings).

3. **Simulation of feeding events**
   A set of “true” coefficients (`β_true`) is defined, and event probability is computed using the logistic function.
   Binary feeding events (`y_feed`) are then generated via Bernoulli sampling.

4. **Bayesian inference via PyMC**
   The model is fitted through posterior inference (`pm.sample`), obtaining probability distributions for each coefficient (`β`).
   This allows not only behavioral prediction but also **quantification of uncertainty** for each variable.

5. **Spatial probability mapping**
   The grid is re-evaluated using posterior samples, producing a **mean probability map** (`prob_map`) that indicates areas with higher feeding likelihood.

6. **Prediction of the next movement point**
   The shark’s current position is used as a reference, and the algorithm searches for the **local maximum probability** within a search radius, simulating the likely direction of movement.

---

## **📊 Visual Output**

The result is a **continuous posterior probability map**, where:

* **Deep red** → high probability of feeding behavior.
* **Dark blue** → low probability.
* **Green dots** → current shark positions.
* **Pink “X” markers** → next predicted positions.
* **Pink lines** → predicted trajectory (movement vector).

This type of visualization can be correlated with real satellite and biotelemetry tag data for scientific validation.

---

## **🧪 Scientific Applications**

* **Integration with NASA satellite data (PACE, MODIS, SWOT)** for validation of biological hotspots.
* **Spatial ecology and marine conservation studies**, by estimating priority feeding zones.
* **Development of intelligent embedded systems** for tags capable of on-board prediction (*on-tag modeling*).
* **Training of oceanographic AI models** based on realistic probabilistic inference.

---

## **🔧 Technical Requirements**

* Python ≥ 3.10
* PyMC ≥ 5.12
* ArviZ ≥ 0.18
* Matplotlib ≥ 3.8
* NumPy ≥ 1.26

Installation (for Colab or local environment):

```bash
pip install pymc arviz matplotlib numpy
```

---

## **⚖️ License**

This project is distributed under the **MIT License**, allowing free use for research, modification, and extension, provided that attribution to the original authors is maintained.

---
