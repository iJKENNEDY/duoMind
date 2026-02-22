/**
 * OptionsScreen — Settings for sound, music, and seasonal themes.
 */

import { StorageService } from '../services/StorageService.js';
import { applyTheme } from '../services/ThemeService.js';

const THEMES = [
  { id: 'dark', icon: '🌙', label: 'Dark' },
  { id: 'light', icon: '☀️', label: 'Light' },
  { id: 'summer', icon: '🏖️', label: 'Summer' },
  { id: 'autumn', icon: '🍂', label: 'Autumn' },
  { id: 'winter', icon: '❄️', label: 'Winter' },
  { id: 'spring', icon: '🌸', label: 'Spring' },
];

export function createOptionsScreen({ onBack }) {
  const screen = document.createElement('div');
  const options = StorageService.getOptions();

  const themeButtons = THEMES.map(t => `
      <button class="theme-btn ${options.theme === t.id ? 'active' : ''}" data-theme="${t.id}">
        <span class="theme-btn-icon">${t.icon}</span>
        <span class="theme-btn-label">${t.label}</span>
      </button>
    `).join('');

  screen.innerHTML = `
    <div style="width:100%; max-width:420px; margin:0 auto; padding-top:var(--sp-2xl);">
      <button class="btn btn-ghost" id="opt-back" style="margin-bottom:var(--sp-lg);">← Back</button>
      <h1 style="font-size:var(--fs-2xl); margin-bottom:var(--sp-xl); text-align:center;">⚙️ Options</h1>

      <div style="display:flex; flex-direction:column; gap:var(--sp-lg);">
        <div class="animate-fade-in" style="
          display:flex; align-items:center; justify-content:space-between;
          background:var(--clr-bg-card); padding:var(--sp-md) var(--sp-lg);
          border-radius:var(--radius-md); border:1px solid var(--clr-border);
        ">
          <span>🔊 Sound Effects</span>
          <button class="btn btn-secondary" id="opt-sound" style="min-width:60px;">
            ${options.soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div class="animate-fade-in" style="animation-delay:0.1s;
          display:flex; align-items:center; justify-content:space-between;
          background:var(--clr-bg-card); padding:var(--sp-md) var(--sp-lg);
          border-radius:var(--radius-md); border:1px solid var(--clr-border);
        ">
          <span>🎵 Music</span>
          <button class="btn btn-secondary" id="opt-music" style="min-width:60px;">
            ${options.musicEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        <div class="animate-fade-in" style="animation-delay:0.2s;">
          <p style="font-size:var(--fs-sm); color:var(--clr-text-muted); margin-bottom:var(--sp-sm); text-transform:uppercase; letter-spacing:0.08em;">🎨 Theme</p>
          <div class="theme-grid" id="theme-grid">
            ${themeButtons}
          </div>
        </div>

        <div class="animate-fade-in" style="animation-delay:0.3s; text-align:center; margin-top:var(--sp-lg);">
          <button class="btn btn-ghost" id="opt-reset" style="color:var(--clr-danger);">
            🗑️ Reset All Data
          </button>
        </div>
      </div>
    </div>
  `;

  // Back
  screen.querySelector('#opt-back').addEventListener('click', onBack);

  // Sound toggle
  screen.querySelector('#opt-sound').addEventListener('click', (e) => {
    options.soundEnabled = !options.soundEnabled;
    e.target.textContent = options.soundEnabled ? 'ON' : 'OFF';
    StorageService.saveOptions(options);
  });

  // Music toggle
  screen.querySelector('#opt-music').addEventListener('click', (e) => {
    options.musicEnabled = !options.musicEnabled;
    e.target.textContent = options.musicEnabled ? 'ON' : 'OFF';
    StorageService.saveOptions(options);
  });

  // Theme selection
  screen.querySelector('#theme-grid').addEventListener('click', (e) => {
    const btn = e.target.closest('.theme-btn');
    if (!btn) return;

    const themeId = btn.dataset.theme;
    options.theme = themeId;
    StorageService.saveOptions(options);
    applyTheme(themeId);

    // Update active state
    screen.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });

  // Reset
  screen.querySelector('#opt-reset').addEventListener('click', () => {
    if (confirm('This will delete ALL data including accounts and scores. Are you sure?')) {
      localStorage.clear();
      location.reload();
    }
  });

  return screen;
}
