/**
 * StorageService — Abstracts localStorage for persistence.
 */

const KEYS = {
    USERS: 'duomind_users',
    CURRENT_USER: 'duomind_current_user',
    LEADERBOARD: 'duomind_leaderboard',
    OPTIONS: 'duomind_options',
    SAVE_PREFIX: 'duomind_save_',
};

export class StorageService {
    static _get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    }

    static _set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // ---- Users ----
    static getUsers() {
        return this._get(KEYS.USERS) || {};
    }

    static saveUser(username, userData) {
        const users = this.getUsers();
        users[username] = userData;
        this._set(KEYS.USERS, users);
    }

    static getUser(username) {
        return this.getUsers()[username] || null;
    }

    // ---- Session ----
    static setCurrentUser(username) {
        this._set(KEYS.CURRENT_USER, username);
    }

    static getCurrentUser() {
        return this._get(KEYS.CURRENT_USER);
    }

    static clearCurrentUser() {
        localStorage.removeItem(KEYS.CURRENT_USER);
    }

    // ---- Save Progress ----
    static saveProgress(username, state) {
        this._set(KEYS.SAVE_PREFIX + username, {
            ...state,
            savedAt: Date.now(),
        });
    }

    static loadProgress(username) {
        return this._get(KEYS.SAVE_PREFIX + username);
    }

    static clearProgress(username) {
        localStorage.removeItem(KEYS.SAVE_PREFIX + username);
    }

    // ---- Leaderboard ----
    static getLeaderboard() {
        return this._get(KEYS.LEADERBOARD) || [];
    }

    static addLeaderboardEntry(name, score, level) {
        const board = this.getLeaderboard();
        board.push({
            name,
            score,
            level,
            date: new Date().toLocaleDateString(),
        });
        board.sort((a, b) => b.score - a.score);
        const top = board.slice(0, 20); // Keep top 20
        this._set(KEYS.LEADERBOARD, top);
        return top;
    }

    // ---- Options ----
    static getOptions() {
        return this._get(KEYS.OPTIONS) || {
            soundEnabled: true,
            musicEnabled: true,
            theme: 'dark',
        };
    }

    static saveOptions(options) {
        this._set(KEYS.OPTIONS, options);
    }
}
