/**
 * GameOverScreen — Final score display with retry level + replay options.
 */

export function createGameOverScreen({ score, level, onReplay, onRetryLevel, onMenu }) {
    const screen = document.createElement('div');

    // Star rating (1-3 based on score thresholds)
    const stars = score >= 5000 ? '⭐⭐⭐' : score >= 2000 ? '⭐⭐' : '⭐';

    screen.innerHTML = `
    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:var(--sp-xl); text-align:center;">
      <div class="animate-fade-in">
        <h1 style="font-size: var(--fs-3xl); margin-bottom: var(--sp-sm);">Game Over</h1>
        <p class="subtitle">You reached Level ${level}</p>
      </div>

      <div class="animate-fade-in" style="animation-delay: 0.2s;">
        <div style="font-size: 3rem; margin-bottom: var(--sp-md);">${stars}</div>
        <div style="
          background: var(--clr-bg-card);
          padding: var(--sp-xl) var(--sp-2xl);
          border-radius: var(--radius-xl);
          border: 1px solid var(--clr-border);
        ">
          <p class="hud-label">Final Score</p>
          <p style="
            font-size: var(--fs-3xl);
            font-weight: var(--fw-black);
            color: var(--clr-gold);
            margin-top: var(--sp-xs);
          ">${score.toLocaleString()}</p>
        </div>
      </div>

      <div class="animate-fade-in" style="animation-delay: 0.4s; display:flex; flex-direction:column; gap:var(--sp-md); align-items:center;">
        <button class="btn btn-primary btn-lg" id="go-retry">🔁 Retry Level ${level}</button>
        <div style="display:flex; gap:var(--sp-md); flex-wrap:wrap; justify-content:center;">
          <button class="btn btn-secondary" id="go-replay">🔄 New Game</button>
          <button class="btn btn-ghost" id="go-menu">🏠 Menu</button>
        </div>
      </div>
    </div>
  `;

    screen.querySelector('#go-retry').addEventListener('click', onRetryLevel);
    screen.querySelector('#go-replay').addEventListener('click', onReplay);
    screen.querySelector('#go-menu').addEventListener('click', onMenu);

    return screen;
}
