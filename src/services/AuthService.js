/**
 * AuthService — Client-side authentication (localStorage-based).
 */

import { StorageService } from './StorageService.js';

export class AuthService {
    /**
     * Simple hash for passwords (NOT cryptographically secure — it's a game).
     */
    static _hash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return hash.toString(36);
    }

    /**
     * Register a new user.
     * @returns {{ success: boolean, error?: string }}
     */
    static register(username, password) {
        username = username.trim().toLowerCase();

        if (!username || username.length < 2) {
            return { success: false, error: 'Username must be at least 2 characters' };
        }
        if (!password || password.length < 3) {
            return { success: false, error: 'Password must be at least 3 characters' };
        }

        const existing = StorageService.getUser(username);
        if (existing) {
            return { success: false, error: 'Username already taken' };
        }

        StorageService.saveUser(username, {
            username,
            passwordHash: this._hash(password),
            createdAt: Date.now(),
        });

        StorageService.setCurrentUser(username);
        return { success: true };
    }

    /**
     * Login an existing user.
     * @returns {{ success: boolean, error?: string }}
     */
    static login(username, password) {
        username = username.trim().toLowerCase();

        const user = StorageService.getUser(username);
        if (!user) {
            return { success: false, error: 'User not found' };
        }
        if (user.passwordHash !== this._hash(password)) {
            return { success: false, error: 'Incorrect password' };
        }

        StorageService.setCurrentUser(username);
        return { success: true };
    }

    /**
     * Logout the current user.
     */
    static logout() {
        StorageService.clearCurrentUser();
    }

    /**
     * Get the current logged-in username, or null.
     */
    static getCurrentUser() {
        return StorageService.getCurrentUser();
    }

    /**
     * Check if a user is logged in (not guest).
     */
    static isLoggedIn() {
        return !!this.getCurrentUser();
    }
}
