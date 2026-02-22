/**
 * ScreenManager — Simple SPA screen routing with transitions.
 */

export class ScreenManager {
    constructor(appEl) {
        this.appEl = appEl;
        this.screens = {};
        this.currentScreen = null;
    }

    /**
     * Register a screen with a name and its render function.
     * The render function should return a DOM element with class "screen".
     */
    register(name, renderFn) {
        this.screens[name] = renderFn;
    }

    /**
     * Navigate to a screen by name, passing optional data.
     */
    show(name, data = {}) {
        // Remove current
        const existing = this.appEl.querySelector('.screen');
        if (existing) {
            existing.classList.remove('active');
            setTimeout(() => existing.remove(), 300);
        }

        // Render new
        const renderFn = this.screens[name];
        if (!renderFn) {
            console.error(`Screen "${name}" not registered`);
            return;
        }

        const screen = renderFn(data);
        screen.classList.add('screen');
        this.appEl.appendChild(screen);

        // Trigger reflow for transition
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                screen.classList.add('active');
            });
        });

        this.currentScreen = name;
    }
}
