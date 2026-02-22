/**
 * ThemeService — Apply and manage theme changes.
 */

import { StorageService } from './StorageService.js';

/**
 * Apply a theme by setting data-theme attribute on <html>.
 */
export function applyTheme(themeId) {
    document.documentElement.setAttribute('data-theme', themeId);
}

/**
 * Load and apply the saved theme on boot.
 */
export function initTheme() {
    const options = StorageService.getOptions();
    if (options.theme && options.theme !== 'dark') {
        applyTheme(options.theme);
    }
}
