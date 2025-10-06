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

# 🦈 **Ocean Tag System — Hardware Specification**

---

## 1) 🧪 **Pressure Sensor (must support ≥ 1000 m)**

* **Primary (recommended): Paroscientific Digiquartz series (D-series / oceanography line)**

  * **Why:** Digiquartz transducers are widely used in oceanography, with depth ranges reaching several thousand meters (models up to 2000 m and even 7000 m). They provide high stability, excellent precision, and a long history of reliability in professional marine applications. ([paroscientific.com][1])
  * **Output/integration:** available with digital output (Frequency / RS-232 / custom) or analog; typically requires signal conditioning and operates from 5–12 V depending on the model.

**Practical summary:** choose a Paroscientific Digiquartz model with a 2000 dbar full-scale range (or 4000 dbar for safety margin) to ensure reliable operation below 1000 m depth. ([paroscientific.com][1])

---

## 2) 📡 **Fastloc GPS + Argos (positioning and uplink)**

* **Commercial integrated product:** **Wildlife Computers SPLASH-F / SPLASH10-F (Fastloc® + Argos)**

  * **Why:** these commercial tags combine **Fastloc GPS** (optimized for brief surfacings) with an **Argos transmitter**, enabling summarized data transmission via satellite. They are widely used in marine research and are suitable for direct integration or as technical references. ([wildlifecomputers.com][3])

**Note:** the Fastloc/Argos system is the standard, proven solution for marine wildlife tags that are not recovered, combining accurate positioning and efficient satellite uplink. ([static.wildlifecomputers.com][4])

---

## 3) ⚙️ **Microcontroller (control + light inference / TFLM)**

* **STM32L4 series — example: STM32L452RET6**

  * **Why:** ultra-low-power MCU with Cortex-M4F core, high energy efficiency, adequate memory (512 kB Flash / 160 kB RAM), and multiple interfaces (I²C/SPI/UART). Ideal for control, compression, and light inference (TinyML / TensorFlow Lite Micro). ([STMicroelectronics][5])
  * **Integration:** operates at 3.3 V; recommended to use independent power domains and interrupt-based activation from IMU/pressure triggers. DMA should be used for continuous hydrophone signal acquisition.

---

## 4) 🎤 **Hydrophone (embedded acoustic sensor)**

* **Recommended model:** **Teledyne RESON TC8105**

  * **Why:** compact, broadband (10 Hz–120 kHz) and high-sensitivity hydrophone, designed for professional marine environments. Robust and reliable, suitable for detecting feeding or behavioral sounds of sharks. ([Teledyne Marine][6])
  * **Integration:** requires low-noise preamplifier and 16–24-bit ADC; should be protected with a silicone membrane against biofouling and sealed within the main housing.

---

## 5) 🎧 **Audio Conditioning / ADC**

* **Preamplifier:** low-noise op-amp (e.g., OPA1611 / AD8628 family) or integrated preamp with configurable gain.
* **ADC (audio):** sigma-delta ADC, 16–24 bits, such as **TI PCM1808/PCM186x** (SPI/I²S), for high-fidelity acoustic capture.
* **Integration:** connected to the MCU via DMA, recording in bursts to minimize power consumption.

---

## 6) 🌡️ **Temperature Sensor**

* **Recommended model:** **RBR Solo-T / T-Unit**

  * **Why:** high-precision temperature sensors commonly used in oceanographic instrumentation. Wide operating range, excellent thermal stability, and traceable calibration.
  * **Integration:** digital or analog output depending on model; easy interface via RS-232, RS-485, or proprietary RBR protocol. Ideal for long-term thermal profiling. ([rbr-global.com](https://rbr-global.com))

---

## 7) 🧭 **Accelerometer (IMU)**

* **Recommended model:** **Analog Devices ADXL355**

  * **Why:** high-stability, low-noise triaxial accelerometer with minimal drift — ideal for detecting motion patterns, behavior, and triggering event-based recordings (e.g., acoustic capture).
  * **Integration:** communicates via SPI / I²C; operates from 2.25–3.6 V; can serve as an event trigger for the MCU.

---

## 8) ⚡ **Piezoelectric Harvester + Power Management**

* **Piezo element:** silicone-encapsulated ceramic element (suppliers include MIDE or APC International). Mechanically mounted on the peduncle. ([Mouser Electronics][8])
* **Power IC:** **LTC3588-1 / LTC3588-2 (Analog Devices)** — designed specifically for piezo harvesters, with rectification, regulation, and supercapacitor charging. ([Analog Devices][9])
* **Storage:** supercapacitor + primary Li-SOCl₂ battery. The piezo acts as an auxiliary energy source to extend standby life.

**Important:** the piezo cannot generate enough power for Argos transmissions; it is only used to supplement low-power sensors.

---

## 9) 🔋 **Battery (long-term operation)**

* **Primary (non-rechargeable):** **Tadiran / Saft Li-SOCl₂ (Lithium Thionyl Chloride)** — high energy density, long-life cells ideal for remote monitoring devices. Example: **Tadiran SL-2780/S (19 Ah D-cell)**. ([Evs Supply][10])

**Note:** Li-SOCl₂ batteries are standard in scientific marine instrumentation due to their stability and high pulse current capability.

---

## 10) 💾 **Data Storage**

* **Industrial-grade NAND flash module (SLC)** — for reliable data and audio logging. The module should be sealed with the main PCB, avoiding removable microSDs.

---

## 11) 🧱 **Housing & Mounting**

* **Material:** **AISI 316L stainless steel**, chosen for its high corrosion resistance, availability, and cost-effectiveness compared to titanium.
* **Mounting method:** **nylon screws**, corrosion-proof and dielectric, ensuring lightweight, non-galvanic assembly.
* **Sealing:** dual Viton O-rings; pressure-tested to 1.5× the rated depth.
* **Bulkheads:** sealed coaxial connectors and cable feedthroughs rated IP68.

---

## 12) 📡 **Argos / GPS Antenna (no float)**

* **L-band antenna optimized for Argos + GPS**, integrated directly into the housing with a PEEK dielectric window. In commercial units (e.g., SPLASH10-F), the antenna is already calibrated for near-surface transmission. ([static.wildlifecomputers.com][11])

---

## 13) 🔌 **Electronics: Power Management & Interfaces**

* **Regulators:** DC-DC step-down/step-up converters for 3.3 V and 1.8 V domains.
* **Protection:** BMS circuit for secondary batteries (if used).
* **Interfaces:** UART ↔ Fastloc/Argos; I²C/SPI ↔ sensors; SPI/I²S ↔ audio ADC.

---

## 14) 🧩 **Component Summary — Final Version**

| Component           | Model / Family                        | Justification                                 |
| ------------------- | ------------------------------------- | --------------------------------------------- |
| Pressure Sensor     | Paroscientific Digiquartz (2000 dbar) | Accuracy and deep-water capability (>1000 m)  |
| GPS + Uplink        | Wildlife Computers SPLASH10-F         | Integrated Fastloc GPS + Argos                |
| MCU                 | STM32L452RET6                         | Low-power, TinyML-compatible                  |
| Hydrophone          | Teledyne RESON TC8105                 | Professional broadband hydrophone             |
| ADC / Preamp        | PCM186x + OPA1611                     | High SNR, SPI/I²S interface                   |
| Temperature Sensor  | RBR Solo-T / T-Unit                   | High precision and thermal stability          |
| Accelerometer (IMU) | ADXL355                               | Low noise, event triggering, motion detection |
| Piezo Harvester     | LTC3588-1 / LTC3588-2                 | Dedicated piezo energy harvesting circuit     |
| Battery             | Tadiran SL-2780/S                     | Long life, high energy density                |
| Storage             | Industrial NAND flash (SLC)           | High reliability and endurance                |
| Housing             | AISI 316L steel + nylon screws        | Corrosion resistance, secure assembly         |
| Antenna             | Integrated L-band (Argos+GPS)         | Optimized near-surface communication          |

---

## 🧭 **Integration Notes**

1. **Pressure:** perform thermal calibration and bench validation before sealing.
2. **Audio:** enable processing and inference only during IMU-triggered events.
3. **Temperature:** cross-calibrate with pressure sensor for thermal compensation.
4. **Energy:** LTC3588 buffers energy peaks for auxiliary sensors.
5. **Battery:** prioritize Li-SOCl₂ for long and reliable deployments.
6. **Mounting:** nylon screw system prevents galvanic corrosion and eases field servicing.

---
