/**
 * MenuScreen — Main menu with Play, Login, Register, Leaderboard.
 */

import { EmojiPool } from '../engine/EmojiPool.js';
import { AuthService } from '../services/AuthService.js';

export function createMenuScreen({ onPlay, onPlayGuest, onAuth, onLeaderboard, onOptions, onCredits }) {
    const screen = document.createElement('div');

    const user = AuthService.getCurrentUser();

    screen.innerHTML = `
    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap: var(--sp-xl); text-align:center; padding-top: var(--sp-3xl);">
      <div class="animate-fade-in" style="animation-delay: 0.1s;">
        <h1 class="title" style="font-size: var(--fs-4xl);">🧠 DuoMind</h1>
        <p class="subtitle" style="margin-top: var(--sp-sm);">Find the matching pair!</p>
      </div>

      <div class="animate-fade-in" style="animation-delay: 0.3s; display:flex; flex-direction:column; gap: var(--sp-md); width: 100%; max-width: 300px;">
        ${user ? `
          <p style="color: var(--clr-text-muted);">Welcome back, <strong style="color:var(--clr-accent);">${user}</strong>!</p>
          <button class="btn btn-primary btn-lg" id="menu-play">▶️ Play</button>
          <button class="btn btn-secondary" id="menu-logout">🚪 Logout</button>
        ` : `
          <button class="btn btn-primary btn-lg" id="menu-guest">🎮 Play as Guest</button>
          <button class="btn btn-secondary" id="menu-login">🔑 Login</button>
          <button class="btn btn-secondary" id="menu-register">📝 Register</button>
        `}
      </div>

      <div class="animate-fade-in" style="animation-delay: 0.5s; display:flex; gap: var(--sp-md); flex-wrap:wrap; justify-content:center;">
        <button class="btn btn-ghost" id="menu-leaderboard">🏆 Leaderboard</button>
        <button class="btn btn-ghost" id="menu-options">⚙️ Options</button>
        <button class="btn btn-ghost" id="menu-credits">📜 Credits</button>
      </div>
    </div>

    <div class="floating-emojis" id="floating-bg"></div>
  `;

    // Events
    const playBtn = screen.querySelector('#menu-play');
    if (playBtn) playBtn.addEventListener('click', onPlay);

    const guestBtn = screen.querySelector('#menu-guest');
    if (guestBtn) guestBtn.addEventListener('click', onPlayGuest);

    const loginBtn = screen.querySelector('#menu-login');
    if (loginBtn) loginBtn.addEventListener('click', () => onAuth('login'));

    const registerBtn = screen.querySelector('#menu-register');
    if (registerBtn) registerBtn.addEventListener('click', () => onAuth('register'));

    const logoutBtn = screen.querySelector('#menu-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
        AuthService.logout();
        location.reload();
    });

    screen.querySelector('#menu-leaderboard').addEventListener('click', onLeaderboard);
    screen.querySelector('#menu-options').addEventListener('click', onOptions);
    screen.querySelector('#menu-credits').addEventListener('click', onCredits);

    // Floating emojis background
    _spawnFloatingEmojis(screen.querySelector('#floating-bg'));

    return screen;
}

function _spawnFloatingEmojis(container) {
    if (!container) return;
    for (let i = 0; i < 15; i++) {
        const el = document.createElement('span');
        el.className = 'floating-emoji';
        el.textContent = EmojiPool.getRandomEmoji();
        el.style.left = `${Math.random() * 100}%`;
        el.style.animationDuration = `${8 + Math.random() * 12}s`;
        el.style.animationDelay = `${Math.random() * 10}s`;
        el.style.fontSize = `${1.5 + Math.random() * 2}rem`;
        container.appendChild(el);
    }
}
