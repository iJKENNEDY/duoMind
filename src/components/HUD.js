/**
 * HUD Component — Heads-Up Display showing score, timer, level, lives.
 */

import { Timer } from '../engine/Timer.js';

export function createHUD() {
    const hud = document.createElement('div');
    hud.className = 'hud';
    hud.id = 'game-hud';

    hud.innerHTML = `
    <div class="hud-item">
      <span class="hud-label">Level</span>
      <span class="hud-value level" id="hud-level">1</span>
    </div>
    <div class="hud-item">
      <span class="hud-label">Score</span>
      <span class="hud-value score" id="hud-score">0</span>
    </div>
    <div class="hud-item">
      <span class="hud-label">Time</span>
      <span class="hud-value timer" id="hud-timer">1:00</span>
    </div>
    <div class="hud-item">
      <span class="hud-label">Lives</span>
      <span class="hud-value lives" id="hud-lives">❤️❤️❤️❤️❤️</span>
    </div>
    <button class="btn btn-icon btn-secondary" id="hud-pause" title="Pause">⏸️</button>
  `;

    return hud;
}

export function updateHUD(state) {
    const levelEl = document.getElementById('hud-level');
    const scoreEl = document.getElementById('hud-score');
    const timerEl = document.getElementById('hud-timer');
    const livesEl = document.getElementById('hud-lives');

    if (levelEl) levelEl.textContent = state.level;
    if (scoreEl) scoreEl.textContent = state.score.toLocaleString();
    if (timerEl) {
        timerEl.textContent = Timer.format(state.timeRemaining);
        timerEl.classList.toggle('animate-pulse', state.timeRemaining <= 10);
    }
    if (livesEl) {
        livesEl.textContent = '❤️'.repeat(state.lives) + '🖤'.repeat(Math.max(0, 5 - state.lives));
    }
}
