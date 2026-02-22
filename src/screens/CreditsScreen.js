/**
 * CreditsScreen — Project credits and information.
 */

export function createCreditsScreen({ onBack }) {
    const screen = document.createElement('div');

    screen.innerHTML = `
    <div style="width:100%; max-width:420px; margin:0 auto; padding-top:var(--sp-2xl);">
      <button class="btn btn-ghost" id="credits-back" style="margin-bottom:var(--sp-lg);">← Back</button>
      <h1 style="font-size:var(--fs-2xl); margin-bottom:var(--sp-xl); text-align:center;">📜 Credits</h1>

      <div style="
        background:var(--clr-bg-card); padding:var(--sp-xl);
        border-radius:var(--radius-xl); border:1px solid var(--clr-border);
        text-align:center; display:flex; flex-direction:column; gap:var(--sp-lg);
      ">
        <div class="animate-fade-in">
          <h2 style="font-size:var(--fs-xl); background:var(--grad-card-back); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;">
            🧠 DuoMind
          </h2>
          <p style="color:var(--clr-text-muted); font-size:var(--fs-sm); margin-top:var(--sp-xs);">
            v1.0.0 — Memory Card Matching Game
          </p>
        </div>

        <div class="animate-fade-in" style="animation-delay:0.1s;">
          <p style="color:var(--clr-text-muted); font-size:var(--fs-sm);">Developed with</p>
          <p style="font-size:var(--fs-lg); margin-top:var(--sp-xs);">💜 Vanilla JavaScript + Vite</p>
        </div>

        <div class="animate-fade-in" style="animation-delay:0.2s;">
          <p style="color:var(--clr-text-muted); font-size:var(--fs-sm);">Design Inspired by</p>
          <p style="font-size:var(--fs-lg); margin-top:var(--sp-xs);">🃏 Pokémon Card Aesthetics</p>
        </div>

        <div class="animate-fade-in" style="animation-delay:0.3s;">
          <p style="color:var(--clr-text-muted); font-size:var(--fs-sm);">Cards use native system emojis</p>
          <p style="font-size: 2rem; margin-top:var(--sp-xs);">🐶 🍕 🌸 🎮 ❤️ 🚀</p>
        </div>

        <div class="animate-fade-in" style="animation-delay:0.4s; padding-top:var(--sp-md); border-top:1px solid var(--clr-border);">
          <p style="color:var(--clr-text-muted); font-size:var(--fs-xs);">
            Made with ❤️ by DuoMind Team — 2026
          </p>
        </div>
      </div>
    </div>
  `;

    screen.querySelector('#credits-back').addEventListener('click', onBack);

    return screen;
}
