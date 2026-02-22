/**
 * AuthScreen — Login and Register forms.
 */

import { AuthService } from '../services/AuthService.js';

export function createAuthScreen({ mode = 'login', onSuccess, onBack }) {
    const screen = document.createElement('div');
    const isLogin = mode === 'login';

    screen.innerHTML = `
    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:var(--sp-xl); width:100%; max-width:380px; margin:0 auto;">
      <button class="btn btn-ghost" id="auth-back" style="align-self:flex-start;">← Back</button>

      <div class="animate-fade-in" style="text-align:center;">
        <h1 style="font-size: var(--fs-2xl);">${isLogin ? '🔑 Login' : '📝 Register'}</h1>
        <p class="subtitle" style="margin-top:var(--sp-xs);">${isLogin ? 'Welcome back!' : 'Create your account'}</p>
      </div>

      <form id="auth-form" class="animate-fade-in" style="animation-delay:0.2s; display:flex; flex-direction:column; gap:var(--sp-md); width:100%;">
        <div class="input-group">
          <label for="auth-username">Username</label>
          <input type="text" id="auth-username" placeholder="Enter username" autocomplete="username" />
        </div>

        <div class="input-group">
          <label for="auth-password">Password</label>
          <input type="password" id="auth-password" placeholder="Enter password" autocomplete="${isLogin ? 'current-password' : 'new-password'}" />
        </div>

        <p id="auth-error" style="color:var(--clr-danger); font-size:var(--fs-sm); display:none;"></p>

        <button type="submit" class="btn btn-primary btn-lg" style="margin-top:var(--sp-sm);">
          ${isLogin ? '🔑 Login' : '📝 Create Account'}
        </button>
      </form>

      <p class="animate-fade-in" style="animation-delay:0.4s; color:var(--clr-text-muted); font-size:var(--fs-sm);">
        ${isLogin
            ? 'Don\'t have an account? <a href="#" id="auth-switch" style="color:var(--clr-accent);">Register</a>'
            : 'Already have an account? <a href="#" id="auth-switch" style="color:var(--clr-accent);">Login</a>'}
      </p>
    </div>
  `;

    // Back
    screen.querySelector('#auth-back').addEventListener('click', onBack);

    // Switch mode
    screen.querySelector('#auth-switch').addEventListener('click', (e) => {
        e.preventDefault();
        onBack();
        // Small delay so screen teardown happens cleanly
        setTimeout(() => {
            const newMode = isLogin ? 'register' : 'login';
            onSuccess.__screenManager?.show('auth', { mode: newMode, onSuccess, onBack });
        }, 100);
    });

    // Form submit
    screen.querySelector('#auth-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = screen.querySelector('#auth-username').value;
        const password = screen.querySelector('#auth-password').value;
        const errorEl = screen.querySelector('#auth-error');

        const result = isLogin
            ? AuthService.login(username, password)
            : AuthService.register(username, password);

        if (result.success) {
            onSuccess();
        } else {
            errorEl.textContent = result.error;
            errorEl.style.display = 'block';
        }
    });

    return screen;
}
