# Subway Surfer Clone 🏄‍♂️

A simple 3D infinite runner game built with **Three.js** and **Vite**.

## 🎮 How to Play

Run as far as you can while dodging obstacles and collecting coins!

- **Avoid** the Green Boxes and Red Trains 🚂
- **Collect** the Gold Coins for +100 points 🪙
- **Speed** increases over time!

## 🕹️ Controls

| Key | Action |
| :--- | :--- |
| **Left Arrow** | Move Left |
| **Right Arrow** | Move Right |
| **Space** / **Up Arrow** | Jump |
| **Click** | Start / Restart Game |

## 🚀 Installation & Running

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the development server:**
    ```bash
    npm run dev
    ```

3.  Open the URL shown in the terminal (usually `http://localhost:5173`) in your browser.

## 🛠️ Technologies

- [Three.js](https://threejs.org/) - 3D Rendering
- [Vite](https://vitejs.dev/) - Build Tool
- Vanilla JavaScript

## 📂 Folder Structure

- **`src/`**: Contains the game logic.
    - **`main.js`**: Entry point. Initializes the `Game` instance.
    - **`Game.js`**: Manages the 3D scene, camera, renderer, and the main game loop.
    - **`Player.js`**: Handles the player character, movement, jumping, and animation.
    - **`World.js`**: Manages the infinite track, spawning obstacles (trains, boxes), and coins.
- **`dist/`**: The "Distribution" folder. Contains the optimized, production-ready build of the game (created when you run `npm run build`).
- **`index.html`**: The main HTML file containing the game canvas container and UI overlays.
- **`style.css`**: CSS for the UI elements (Start screen, Game Over, Score).
- **`package.json`**: Project configuration and dependencies.

