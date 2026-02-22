/**
 * DuoMind — Main Entry Point
 * Wires up ScreenManager, GameEngine, and all screens.
 * Supports 2D (5 shapes) and 3D (3 geometries) game modes.
 */

import './style.css';
import { ScreenManager } from './screens/ScreenManager.js';
import { GameEngine } from './engine/GameEngine.js';
import { AuthService } from './services/AuthService.js';
import { StorageService } from './services/StorageService.js';
import { initTheme } from './services/ThemeService.js';

import { createMenuScreen } from './screens/MenuScreen.js';
import { createModeSelectScreen } from './screens/ModeSelectScreen.js';
import { createGameScreen } from './screens/GameScreen.js';
import { createGame3DScreen } from './screens/Game3DScreen.js';
import { createGameOverScreen } from './screens/GameOverScreen.js';
import { createAuthScreen } from './screens/AuthScreen.js';
import { createLeaderboardScreen } from './screens/LeaderboardScreen.js';
import { createOptionsScreen } from './screens/OptionsScreen.js';
import { createCreditsScreen } from './screens/CreditsScreen.js';

// Apply saved theme on boot
initTheme();

const app = document.getElementById('app');
const sm = new ScreenManager(app);
const engine = new GameEngine();

// Track current mode and shape
let currentMode = '2d';
let currentShape = 'rectangle';

// ------ Helper: start gameplay ------
function startGame(mode = '2d', shape = 'rectangle') {
    currentMode = mode;
    currentShape = shape;

    const user = AuthService.getCurrentUser();

    // Try to resume saved progress
    if (user) {
        const saved = StorageService.loadProgress(user);
        if (saved) {
            engine.resumeGame(saved);
        } else {
            engine.startGame();
        }
    } else {
        engine.startGame();
    }

    // Game over handler
    engine.onGameOver = (score, level) => {
        const playerName = AuthService.getCurrentUser() || 'Guest';
        StorageService.addLeaderboardEntry(playerName, score, level);

        if (AuthService.isLoggedIn()) {
            StorageService.clearProgress(playerName);
        }

        sm.show('gameover', { score, level });
    };

    if (mode === '3d') {
        sm.show('game3d', { shape });
    } else {
        sm.show('game', { shape });
    }
}

// ------ Helper: restart same level ------
function restartCurrentLevel() {
    engine.restartLevel();
    if (currentMode === '3d') {
        sm.show('game3d', { shape: currentShape });
    } else {
        sm.show('game', { shape: currentShape });
    }
}

// ------ Register screens ------

sm.register('menu', () =>
    createMenuScreen({
        onPlay: () => sm.show('modeselect'),
        onPlayGuest: () => sm.show('modeselect'),
        onAuth: (mode) => sm.show('auth', { mode }),
        onLeaderboard: () => sm.show('leaderboard'),
        onOptions: () => sm.show('options'),
        onCredits: () => sm.show('credits'),
    })
);

sm.register('modeselect', () =>
    createModeSelectScreen({
        onSelect2D: (shape) => startGame('2d', shape),
        onSelect3D: (shape) => startGame('3d', shape),
        onBack: () => sm.show('menu'),
    })
);

sm.register('game', (data) =>
    createGameScreen({
        engine,
        shape: data?.shape || 'rectangle',
        onPause: () => engine.pause(),
        onQuit: () => {
            engine.timer.stop();
            const user = AuthService.getCurrentUser();
            if (user) {
                StorageService.saveProgress(user, engine.getSaveState());
            }
            sm.show('menu');
        },
    })
);

sm.register('game3d', (data) =>
    createGame3DScreen({
        engine,
        shape: data?.shape || 'cube',
        onQuit: () => {
            engine.timer.stop();
            const user = AuthService.getCurrentUser();
            if (user) {
                StorageService.saveProgress(user, engine.getSaveState());
            }
            sm.show('menu');
        },
    })
);

sm.register('gameover', (data) =>
    createGameOverScreen({
        score: data.score,
        level: data.level,
        onReplay: () => sm.show('modeselect'),
        onRetryLevel: () => restartCurrentLevel(),
        onMenu: () => sm.show('menu'),
    })
);

sm.register('auth', (data) =>
    createAuthScreen({
        mode: data.mode || 'login',
        onSuccess: () => sm.show('menu'),
        onBack: () => sm.show('menu'),
    })
);

sm.register('leaderboard', () =>
    createLeaderboardScreen({
        onBack: () => sm.show('menu'),
    })
);

sm.register('options', () =>
    createOptionsScreen({
        onBack: () => sm.show('menu'),
    })
);

sm.register('credits', () =>
    createCreditsScreen({
        onBack: () => sm.show('menu'),
    })
);

// ------ Boot ------
sm.show('menu');
