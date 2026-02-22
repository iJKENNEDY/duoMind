# 🧠 DuoMind — Memory Card Matching Game

A Pokémon-card styled memory matching game with **2D and 3D modes**, emoji cards, galaxy backgrounds, and 6 seasonal themes. Flip cards, find pairs, beat the clock!

![Vanilla JS](https://img.shields.io/badge/Vanilla-JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-r170-black?logo=threedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

| Feature              | Description                                              |
|----------------------|----------------------------------------------------------|
| 🎮 **2D Mode**       | Classic flat card matching with 5 card shapes             |
| 🧊 **3D Mode**       | Each card is its own 3D object (cube, sphere, or cylinder)|
| 🌌 **Galaxy BG**     | Random starfield with nebula clouds in 3D scene           |
| 🃏 **2D Shapes**     | Rectangle, Square, Pentagon, Hexagon, Circle              |
| 📦 **3D Geometries** | Cube (glass), Sphere (glass), Cylinder (solid)            |
| 🔒 **Access Control**| 2D for everyone, 3D for registered users only             |
| 👀 **Card Preview**  | All cards revealed briefly before each level              |
| 📈 **Level Progression** | 10 → 20 → 30… cards per level (capped at 60)         |
| 🏆 **Scoring**       | 100 pts/match + combo bonus + time bonus                  |
| ⏱️ **Timer**         | Countdown per level (60s + 15s/level), +3s per match      |
| ❤️ **Lives**         | 5 hearts, lose one per mismatch, +1 on level-up           |
| 🔁 **Retry Level**   | Retry same level with full lives on game over              |
| 🎨 **6 Themes**      | Dark, Light, Summer, Autumn, Winter, Spring                |
| ✨ **Neon Emojis**    | Large emoji icons with glowing neon outlines               |
| 🔑 **Auth**          | Guest play or register/login (localStorage)                |
| 💾 **Save Progress** | Auto-saves on quit for registered users                    |
| 🏅 **Leaderboard**   | Top 20 scores with medal rankings                          |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+

### Installation

```bash
git clone https://github.com/iJKENNEDY/duoMind.git
cd duoMind
npm install
```

### Development

```bash
npm run dev
# → http://localhost:3000
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🏗️ Project Structure

```text
duoMind/
├── index.html
├── package.json
├── vite.config.js                    # Three.js chunk splitting
└── src/
    ├── main.js                       # App bootstrap, routing, mode tracking
    ├── style.css                     # Design tokens, 6 themes, card shapes
    ├── engine/
    │   ├── EmojiPool.js              # 180 emojis across 6 categories
    │   ├── Timer.js                  # Countdown with pause/resume
    │   └── GameEngine.js             # Cards, matching, scoring, preview, levels
    ├── components/
    │   ├── Card.js                   # 3D flip card with neon emoji glow
    │   ├── Board.js                  # Responsive grid with shape support
    │   └── HUD.js                    # Score, timer, lives display
    ├── screens/
    │   ├── ScreenManager.js          # SPA router with transitions
    │   ├── MenuScreen.js             # Main menu with floating emojis
    │   ├── ModeSelectScreen.js       # 2D/3D mode + shape selector
    │   ├── GameScreen.js             # 2D board + HUD + overlays
    │   ├── Game3DScreen.js           # Three.js 3D scene + galaxy background
    │   ├── GameOverScreen.js         # Score, retry level, new game
    │   ├── AuthScreen.js             # Login / Register forms
    │   ├── LeaderboardScreen.js      # Ranked score list
    │   ├── OptionsScreen.js          # Sound, music, 6-theme grid
    │   └── CreditsScreen.js          # Project info
    └── services/
        ├── AuthService.js            # Register, login, logout
        ├── StorageService.js         # localStorage abstraction
        └── ThemeService.js           # Apply & persist theme
```

---

## 🎮 How to Play

1. **Start** — Click "Play as Guest" or register an account
2. **Choose Mode** — Select 2D (5 shapes) or 3D (3 geometries, registered only)
3. **Preview** — Watch the cards reveal briefly to memorize positions
4. **Flip** — Click a card (2D) or click a 3D object to reveal its emoji
5. **Match** — Find matching pairs before time runs out
6. **Combo** — Chain consecutive matches for bonus points
7. **Level Up** — Clear all pairs to advance
8. **Game Over** — Retry Level, New Game, or Menu

---

## 🎮 Game Modes

### 2D Mode — All Players

Cards displayed on a flat grid. Choose from 5 card shapes:

| Shape           | Style                       |
|-----------------|-----------------------------|
| 🃏 Rectangle    | Classic playing card (default) |
| ⬜ Square       | 1:1 aspect ratio               |
| ⬠ Pentagon     | 5-sided polygon                |
| ⬡ Hexagon      | Honeycomb style                |
| ⚪ Circle       | Round cards                    |

### 3D Mode — Registered Users Only 🔒

**Each card is its own individual 3D object**, arranged in a floating grid over a **random galaxy background** powered by **Three.js**.

Example: 5 pairs = **10 individual 3D shapes** in the scene.

| Geometry     | Material                                   |
|--------------|--------------------------------------------|
| 📦 Cube      | Glass effect (transmission, clearcoat, IOR) |
| 🌐 Sphere    | Glass effect (transmission, clearcoat, IOR) |
| 🥫 Cylinder  | Standard solid (no glass effect)            |

**3D interactions:**

- Click a shape to **flip** it (smooth rotation reveals the emoji)
- Matched pairs **glow cyan** (emissive material)
- Unflipped shapes have a subtle **idle wobble**
- Camera **auto-fits** to the grid size
- **Drag** to orbit, **scroll** to zoom

**3D visuals:**

- 🌌 **Galaxy starfield** with 2000 randomized stars in 6 colors
- 🌀 **3 nebula clouds** (purple, cyan, pink) at random positions
- 🖼️ **ACES Filmic tone mapping** at 1.8x exposure for cinematic contrast
- ✨ **Neon wireframe outlines** (cyan) on every shape

---

## 🎨 Themes

6 built-in themes, selectable from the Options screen:

| Theme       | Palette                        |
|-------------|--------------------------------|
| 🌙 Dark     | Deep purple with electric cyan  |
| ☀️ Light    | Clean white with violet accents |
| 🏖️ Summer   | Warm oranges and golden yellows |
| 🍂 Autumn   | Rich browns and amber tones     |
| ❄️ Winter   | Cool blues and icy grays        |
| 🌸 Spring   | Fresh greens and turquoise      |

---

## 🛠️ Tech Stack

| Technology              | Purpose                                                             |
|-------------------------|---------------------------------------------------------------------|
| **Vite**                | Build tool & dev server                                              |
| **Vanilla JS**          | Game logic & 2D UI                                                   |
| **Three.js**            | 3D mode — geometries, OrbitControls, raycasting, galaxy starfield    |
| **CSS Custom Properties** | Design tokens with 6 theme palettes + clip-path card shapes        |
| **localStorage**        | Client-side persistence                                              |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
