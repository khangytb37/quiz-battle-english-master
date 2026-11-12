<div align="center">

# ⚔️ QUIZ BATTLE: ENGLISH MASTER
### *The Next-Gen Real-Time Multiplayer English Competition Arena*

[![Node.js](https://img.shields.io/badge/Node.js-20.x%20%7C%2022.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Express.js](https://img.shields.io/badge/Express-4.21.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![HTML5 Canvas](https://img.shields.io/badge/HTML5-Canvas%2060FPS-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Web Audio API](https://img.shields.io/badge/Web%20Audio-Synthesizer-9B51E0?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

**Live Battle Arena** • **Interactive Room Competition** • **QR Code Join** • **THPT & IELTS Prep** • **Bilingual (EN / VI)**

[🚀 Quick Start](#-quick-start) • [✨ Key Features](#-key-features) • [🧠 How It Works](#-how-it-works) • [📐 System Architecture](#-system-architecture) • [🎮 Gameplay Guide](#-gameplay-guide)

</div>

---

## 🌟 Overview

**Quiz Battle: English Master** is a high-octane, real-time multiplayer web quiz game tailored specifically for English exam preparation (National High School Graduation Exam / THPT & IELTS). Inspired by premier educational games like *Kahoot*, *Quizizz*, and *Blooket*, this project blends rigorous academic content with engaging gamification mechanics.

Built with pure modern **HTML5, CSS3, and Vanilla JavaScript (ES6+)** on top of a lightweight **Node.js & Socket.io** backend, it requires zero heavy front-end build pipelines and can even run directly in the browser via an embedded **Local Room Simulator** fallback.

---

## ✨ Key Features

### 🏟️ 1. Real-Time Room Competition
* **Instant 6-Digit Room Codes:** Create custom battle rooms with randomized 6-digit codes.
* **Dynamic QR Code Generation:** Real-time QR codes allow players to scan with mobile devices and join lobbies instantly without typing URLs.
* **Live Contestant Grid:** Real-time lobby synchronization with animated avatar badges (`👑 HOST`, `🤖 BOT`, `YOU`).
* **LAN IP Auto-Detection:** Node backend automatically identifies the host's local Wi-Fi IP address so physical phones on the same network can connect directly.

### 🤖 2. Single-Browser Testing via AI Bots & Local Simulator
* **Test Bot Spawner:** Host can spawn synthetic AI bots with configurable profiles (accuracy rate, thinking latency) to simulate a full room competition on a single machine.
* **Dual-Engine Architecture:** Seamlessly switches between full **Socket.io WebSocket** server mode and a client-side **`BroadcastChannel` + LocalStorage Local Simulator** when running static files without Node.

### 🎭 3. Dynamic Mood Arena & Modern 3D Quiz Buttons
* **Mood-Shifting Arena:**
  * **30s ➔ 11s (Focus Phase):** Calm, deep indigo-purple aura with gentle energy streams.
  * **10s ➔ 0s (Crunch Phase):** Screen shifts to high-alert crimson-amber gradient accompanied by a rhythmic heartbeat vignette pulse (`pulseVignette`).
* **3D Kahoot-Style Answer Buttons:** 
  * 🟥 **A (Coral Red `#e21b3c`):** Triangle ▲
  * 🟦 **B (Royal Blue `#1368ce`):** Diamond ◆
  * 🟨 **C (Amber Gold `#d89e00`):** Circle ●
  * 🟩 **D (Emerald Green `#26890c`):** Square ■
* **Physics & VFX:** 3D mechanical press displacement, sparkle burst floating animations on correct answers, and physical screen-shake recoil on errors.

### 🏆 4. Dramatic Podium Award Ceremony
* **Suspenseful Bottom-Up Reveal:** Final rankings reveal incrementally from last place up to the podium.
* **Tension Slowdown Delay:** Announcement pause dramatically lengthens between **#3 ➔ #2 ➔ #1**.
* **Champion Spotlight & Fireworks:** Winner reveal triggers spotlight beams, Web Audio fanfare melodies, and an HTML5 Canvas confetti + spark particle explosion.

### ✍️ 5. Custom Quiz Creator & JSON Portability
* Full in-app visual editor to draft custom questions with 4 choices, designated answer key, category tags, and detailed explanations.
* One-click **JSON Import / Export** for saving, sharing, and loading external test banks.
* Pre-loaded with 5 instant samples and standard curriculum banks.

### 🌐 6. Native Bilingual Support (English Primary / Tiếng Việt)
* One-click header switcher (`🌐 EN / VI`) dynamically translates all game cards, controls, feedback banners, modals, and toasts.
* State persists in `localStorage` across reloads, defaulting to English.

### 🎨 7. Audio Synthesizer & Visual Polishing
* **Synthesized Web Audio:** Zero external MP3 downloads required! All chimes, clicks, correct jingles, error buzzers, and victory fanfares are generated on-the-fly via mathematical oscillators.
* **Canvas Floating Knowledge Symbols:** Deep background canvas floats mathematical and educational glyphs (`?`, `A`, `B`, `C`, `D`, `★`, `⚡`, `🎓`) with parallax depth and subtle cursor repulsion.
* **Responsive Dark / Light Themes:** Sleek Cyberpunk/Neon Dark mode and clean EdTech Light mode.

---

## 🧠 How It Works

```
                        ┌───────────────────────────────┐
                        │      Game Initialization      │
                        └──────────────┬────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
        ┌───────────────────────┐             ┌───────────────────────┐
        │   Socket.io Server    │             │ Local Room Simulator  │
        │ (Multi-device / Phone)│             │ (Static / Offline)    │
        └───────────┬───────────┘             └───────────┬───────────┘
                    │                                     │
                    └──────────────────┬──────────────────┘
                                       ▼
                        ┌───────────────────────────────┐
                        │     Room Waiting Lobby        │
                        │  (QR Code / Bot AI Spawner)   │
                        └──────────────┬────────────────┘
                                       ▼
                        ┌───────────────────────────────┐
                        │        30s Battle Round       │
                        │ • Dynamic Arena Background    │
                        │ • Millisecond Response Timer  │
                        │ • 3D Answer Feedback & VFX    │
                        └──────────────┬────────────────┘
                                       ▼
                        ┌───────────────────────────────┐
                        │   Bottom-Up Award Ceremony    │
                        │ • Suspense Pause on Top 3     │
                        │ • Spotlight & Fireworks #1    │
                        │ • Review Mistakes with Key    │
                        └───────────────────────────────┘
```

### 1. Leaderboard Ranking Algorithm
Rankings prioritize accuracy first, followed by speed as a secondary tie-breaker:
$$\text{Priority 1:} \quad \max(\text{Correct Answers})$$
$$\text{Priority 2 (Tie-breaker):} \quad \min(\text{Total Response Time in ms})$$

### 2. Microsecond Precision Timer
Instead of relying on browser `setInterval` which drifts and causes layout thrashing, Quiz Battle leverages `performance.now()` with high-frequency `requestAnimationFrame` and GPU-accelerated CSS `transform: scaleX()` transitions.

---

## 📐 System Architecture

| Component | Technology | Responsibility |
| :--- | :--- | :--- |
| **Frontend Core** | HTML5, CSS3, Vanilla JS ES6+ | Zero-dependency, lightweight, high-performance UI |
| **Background VFX** | HTML5 Canvas 2D Context | 60 FPS floating symbol particles & mouse repulsion |
| **Fireworks Engine**| HTML5 Canvas Particles | Confetti ribbons and fireworks explosion for awards |
| **Sound Synthesis**| Web Audio API (`AudioContext`) | Pure algorithmic oscillator sound effects |
| **Networking** | Socket.io v4 & WebSockets | Room state synchronization, live answers, standings |
| **Offline Fallback**| `BroadcastChannel` + LocalStorage | Seamless multi-tab testing without running a server |
| **Mobile Gateway** | `qrcode` + OS Network Interfaces | Generates dynamic QR codes mapping to local Wi-Fi IP |
| **Localization** | Custom `i18n.js` Engine | Declarative DOM updates via `data-i18n` attributes |

---

## 🚀 Quick Start

### Option A: Full Multiplayer Server (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/quiz-battle-english-master.git
   cd quiz-battle-english-master
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Play:**
   * Open your desktop browser: `http://localhost:3000`
   * Open on your phone: Connect to the same Wi-Fi network and scan the in-game QR code or navigate to `http://<YOUR_LAN_IP>:3000`.

---

### Option B: Zero-Install Standalone Mode

Don't have Node.js installed? Simply double-click **`index.html`** or open it via any browser or VS Code Live Server!
* The game automatically activates the **Local Room Simulator**.
* You can test room creation, spawn AI bots, and play 1v1 or Solo Speedrun modes completely offline.

---

## 🎮 Gameplay Guide

### Game Modes

| Mode | Target | Rules & Win Condition |
| :--- | :--- | :--- |
| **Room Competition** | Group / Classroom (2 - 50+ players) | 30s per question. Highest score with fastest cumulative response time wins the podium. |
| **1v1 Bot Duel** | Solo vs Simulated AI Master | 100 HP duel. Correct answers deal damage (boosted in first 3s & combos); wrong answers deplete player HP. Knock out the bot to win! |
| **Solo Speedrun** | High Score Training | Complete question batches as quickly and accurately as possible to top the local leaderboard. |

### Tactical Power-ups (Usable 1x per match)
* ✂️ **[50:50]**: Instantly eliminates 2 incorrect options.
* ❄️ **[Freeze]**: Freezes the 30-second countdown for 4 seconds, granting breathing room on complex reading passages.
* 🛡️ **[Shield / Hint]**: In 1v1 mode, nullifies the HP penalty on your next mistake; in Room mode, reveals an intelligent grammatical clue.

### Keyboard Shortcuts
* <kbd>A</kbd> / <kbd>1</kbd> : Option A (Coral Red ▲)
* <kbd>B</kbd> / <kbd>2</kbd> : Option B (Royal Blue ◆)
* <kbd>C</kbd> / <kbd>3</kbd> : Option C (Amber Gold ●)
* <kbd>D</kbd> / <kbd>4</kbd> : Option D (Emerald Green ■)
* <kbd>Q</kbd> : Trigger **50:50**
* <kbd>W</kbd> : Trigger **Freeze**
* <kbd>E</kbd> : Trigger **Shield / Hint**
* <kbd>Enter</kbd> : Continue to next question from explanation popup

---

## 📂 Project Structure

```
d:/Quiz Game/
├── index.html            # Main markup with responsive views & modal overlays
├── style.css             # Glassmorphism, 3D buttons, neon themes & animations
├── app.js                # Core game logic, state machine, audio & particle systems
├── i18n.js               # Bilingual translation engine (EN primary / VI secondary)
├── questions.js          # Standard 20-question THPT/IELTS exam question bank
├── server.js             # Express + Socket.io server with QR generation & LAN detection
├── package.json          # Project metadata, scripts and dependencies
└── README.md             # Project documentation
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/your-username/quiz-battle-english-master/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built with ❤️ for English learners, educators, and gamers worldwide.</sub>
</div>
