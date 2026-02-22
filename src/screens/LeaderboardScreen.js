/**
 * LeaderboardScreen — Ranked score list.
 */

import { StorageService } from '../services/StorageService.js';
import { AuthService } from '../services/AuthService.js';

export function createLeaderboardScreen({ onBack }) {
    const screen = document.createElement('div');
    const entries = StorageService.getLeaderboard();
    const currentUser = AuthService.getCurrentUser();

    const rows = entries.length > 0
        ? entries.map((entry, i) => {
            const isMe = entry.name === currentUser;
            const rankEmoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;
            return `
          <div class="leaderboard-row ${isMe ? 'highlight' : ''} animate-fade-in" style="animation-delay: ${i * 0.05}s;">
            <span class="leaderboard-rank">${rankEmoji}</span>
            <span class="leaderboard-name">${entry.name}</span>
            <span style="color:var(--clr-text-muted); font-size:var(--fs-sm);">Lv.${entry.level}</span>
            <span class="leaderboard-score">${entry.score.toLocaleString()}</span>
          </div>
        `;
        }).join('')
        : '<p style="color:var(--clr-text-muted); text-align:center; padding:var(--sp-xl);">No scores yet. Be the first to play! 🎮</p>';

    screen.innerHTML = `
    <div style="width:100%; max-width:500px; margin:0 auto; padding-top:var(--sp-2xl);">
      <button class="btn btn-ghost" id="lb-back" style="margin-bottom:var(--sp-lg);">← Back</button>
      <h1 style="font-size:var(--fs-2xl); margin-bottom:var(--sp-xl); text-align:center;">🏆 Leaderboard</h1>
      <div class="leaderboard-list">
        ${rows}
      </div>
    </div>
  `;

    screen.querySelector('#lb-back').addEventListener('click', onBack);

    return screen;
}
