/**
 * ModeSelectScreen — Choose between 2D and 3D game modes.
 * 2D: available to everyone. 3D: registered users only.
 */

import { AuthService } from '../services/AuthService.js';

const SHAPES_2D = [
    { id: 'rectangle', icon: '🃏', label: 'Naipe', desc: 'Classic card' },
    { id: 'square', icon: '⬜', label: 'Cuadrado', desc: 'Square' },
    { id: 'pentagon', icon: '⬠', label: 'Pentágono', desc: 'Pentagon' },
    { id: 'hexagon', icon: '⬡', label: 'Hexágono', desc: 'Honeycomb' },
    { id: 'circle', icon: '⚪', label: 'Círculo', desc: 'Circle' },
];

const SHAPES_3D = [
    { id: 'cube', icon: '📦', label: 'Cubo', desc: 'Cube' },
    { id: 'sphere', icon: '🌐', label: 'Esfera', desc: 'Sphere' },
    { id: 'cylinder', icon: '🥫', label: 'Cilindro', desc: 'Cylinder' },
];

export function createModeSelectScreen({ onSelect2D, onSelect3D, onBack }) {
    const screen = document.createElement('div');
    const isLoggedIn = AuthService.isLoggedIn();

    const shape2DButtons = SHAPES_2D.map(s => `
    <button class="shape-btn animate-fade-in" data-shape="${s.id}" data-mode="2d">
      <span class="shape-btn-icon">${s.icon}</span>
      <span class="shape-btn-label">${s.label}</span>
    </button>
  `).join('');

    const shape3DButtons = SHAPES_3D.map(s => `
    <button class="shape-btn shape-btn-3d animate-fade-in ${!isLoggedIn ? 'disabled' : ''}" data-shape="${s.id}" data-mode="3d" ${!isLoggedIn ? 'disabled' : ''}>
      <span class="shape-btn-icon">${s.icon}</span>
      <span class="shape-btn-label">${s.label}</span>
    </button>
  `).join('');

    screen.innerHTML = `
    <div style="width:100%; max-width:500px; margin:0 auto; display:flex; flex-direction:column; gap:var(--sp-xl); padding: var(--sp-xl) 0;">
      <button class="btn btn-ghost" id="mode-back">← Back</button>

      <div style="text-align:center;" class="animate-fade-in">
        <h1 style="font-size:var(--fs-2xl);">🎯 Choose Mode</h1>
        <p class="subtitle" style="margin-top:var(--sp-xs);">Select a game mode and card shape</p>
      </div>

      <!-- 2D Section -->
      <div class="animate-fade-in" style="animation-delay:0.1s;">
        <div style="display:flex; align-items:center; gap:var(--sp-sm); margin-bottom:var(--sp-md);">
          <span style="font-size:var(--fs-xl); font-weight:var(--fw-bold);">2D Mode</span>
          <span style="font-size:var(--fs-xs); color:var(--clr-success); background:rgba(105,240,174,0.15); padding:2px 8px; border-radius:var(--radius-sm);">All Players</span>
        </div>
        <div class="shape-grid" id="shapes-2d">
          ${shape2DButtons}
        </div>
      </div>

      <!-- 3D Section -->
      <div class="animate-fade-in" style="animation-delay:0.2s;">
        <div style="display:flex; align-items:center; gap:var(--sp-sm); margin-bottom:var(--sp-md);">
          <span style="font-size:var(--fs-xl); font-weight:var(--fw-bold);">3D Mode</span>
          ${isLoggedIn
            ? '<span style="font-size:var(--fs-xs); color:var(--clr-accent); background:rgba(0,229,255,0.15); padding:2px 8px; border-radius:var(--radius-sm);">Unlocked ✓</span>'
            : '<span style="font-size:var(--fs-xs); color:var(--clr-danger); background:rgba(255,82,82,0.15); padding:2px 8px; border-radius:var(--radius-sm);">🔒 Register Required</span>'
        }
        </div>
        <div class="shape-grid shape-grid-3col" id="shapes-3d">
          ${shape3DButtons}
        </div>
        ${!isLoggedIn ? '<p style="color:var(--clr-text-muted); font-size:var(--fs-sm); margin-top:var(--sp-sm);">Register an account to unlock 3D mode!</p>' : ''}
      </div>
    </div>
  `;

    // Back button
    screen.querySelector('#mode-back').addEventListener('click', onBack);

    // 2D shape buttons
    screen.querySelector('#shapes-2d').addEventListener('click', (e) => {
        const btn = e.target.closest('.shape-btn');
        if (!btn) return;
        onSelect2D(btn.dataset.shape);
    });

    // 3D shape buttons
    screen.querySelector('#shapes-3d').addEventListener('click', (e) => {
        const btn = e.target.closest('.shape-btn');
        if (!btn || btn.disabled) return;
        onSelect3D(btn.dataset.shape);
    });

    return screen;
}
