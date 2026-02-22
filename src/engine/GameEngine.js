/**
 * GameEngine — Central game controller.
 * Manages card state, matching logic, scoring, lives, and level progression.
 */

import { EmojiPool } from './EmojiPool.js';
import { Timer } from './Timer.js';

const LEVEL_CONFIG = {
    basePairs: 5,          // Level 1 = 5 pairs (10 cards)
    pairsPerLevel: 5,      // Each level adds 5 more pairs (+10 cards)
    maxPairs: 30,           // Cap at 30 pairs (60 cards)
    baseTime: 60,           // Level 1 = 60 seconds
    timePerLevel: 15,       // Each level adds 15 seconds
    maxLives: 5,
    pointsPerMatch: 100,
    comboMultiplier: 50,    // Bonus per consecutive match
    timeBonusPerMatch: 3,   // Seconds added per match
};

export class GameEngine {
    constructor() {
        this.timer = new Timer();
        this.reset();

        // Callbacks
        this.onStateChange = null;    // (state) => {}
        this.onLevelComplete = null;  // (level, score) => {}
        this.onGameOver = null;       // (score, level) => {}
        this.onCardFlip = null;       // (index) => {}
        this.onMatch = null;          // (idx1, idx2) => {}
        this.onMismatch = null;       // (idx1, idx2) => {}

        // Timer wiring
        this.timer.onTick = (remaining) => {
            this._emitState();
        };
        this.timer.onTimeout = () => {
            this._gameOver();
        };
    }

    reset() {
        this.level = 1;
        this.score = 0;
        this.lives = LEVEL_CONFIG.maxLives;
        this.combo = 0;
        this.cards = [];
        this.flippedIndices = [];
        this.matchedIndices = new Set();
        this.isLocked = false;
        this.isPaused = false;
        this.isRunning = false;
        this.totalMatches = 0;
    }

    /**
     * Start a new game from level 1.
     */
    startGame() {
        this.reset();
        this._startLevel();
    }

    /**
     * Resume a saved game state.
     */
    resumeGame(state) {
        this.level = state.level || 1;
        this.score = state.score || 0;
        this.lives = state.lives || LEVEL_CONFIG.maxLives;
        this._startLevel();
    }

    /**
     * Start the current level.
     */
    _startLevel() {
        const pairs = this._getPairsForLevel(this.level);
        const emojis = EmojiPool.getRandomPairs(pairs);

        this.cards = emojis.map((emoji, index) => ({
            id: index,
            emoji,
            isFlipped: false,
            isMatched: false,
        }));

        this.flippedIndices = [];
        this.matchedIndices = new Set();
        this.isLocked = true; // Locked during preview
        this.isPaused = false;
        this.isRunning = true;
        this.isPreviewing = true;
        this.combo = 0;

        this._emitState();
    }

    /**
     * Quick preview: reveal all cards briefly, then flip back and start timer.
     * @param {Function} onPreviewDone - called when preview ends
     */
    startAfterPreview(onPreviewDone) {
        // Flip all cards face-up
        this.cards.forEach(c => c.isFlipped = true);
        this._emitState();

        setTimeout(() => {
            // Flip all back
            this.cards.forEach(c => c.isFlipped = false);
            this.isLocked = false;
            this.isPreviewing = false;

            const time = this._getTimeForLevel(this.level);
            this.timer.start(time);

            this._emitState();
            if (onPreviewDone) onPreviewDone();
        }, 1500); // 1.5s preview
    }

    /**
     * Restart the current level (on game over), reset lives.
     */
    restartLevel() {
        this.lives = LEVEL_CONFIG.maxLives;
        this.combo = 0;
        this._startLevel();
    }

    /**
     * Flip a card at the given index.
     */
    flipCard(index) {
        if (this.isLocked || this.isPaused || !this.isRunning) return;
        if (this.matchedIndices.has(index)) return;
        if (this.flippedIndices.includes(index)) return;

        this.cards[index].isFlipped = true;
        this.flippedIndices.push(index);

        if (this.onCardFlip) this.onCardFlip(index);

        if (this.flippedIndices.length === 2) {
            this.isLocked = true;
            this._checkMatch();
        }

        this._emitState();
    }

    /**
     * Check if the two flipped cards match.
     */
    _checkMatch() {
        const [i, j] = this.flippedIndices;
        const card1 = this.cards[i];
        const card2 = this.cards[j];

        if (card1.emoji === card2.emoji) {
            // Match!
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchedIndices.add(i);
            this.matchedIndices.add(j);
            this.totalMatches++;

            // Score
            this.combo++;
            const points = LEVEL_CONFIG.pointsPerMatch + (this.combo - 1) * LEVEL_CONFIG.comboMultiplier;
            this.score += points;

            // Time bonus
            this.timer.addTime(LEVEL_CONFIG.timeBonusPerMatch);

            if (this.onMatch) this.onMatch(i, j);

            this.flippedIndices = [];
            this.isLocked = false;
            this._emitState();

            // Check level complete
            if (this.matchedIndices.size === this.cards.length) {
                this._levelComplete();
            }
        } else {
            // Mismatch
            this.combo = 0;
            this.lives--;

            if (this.onMismatch) this.onMismatch(i, j);

            setTimeout(() => {
                card1.isFlipped = false;
                card2.isFlipped = false;
                this.flippedIndices = [];
                this.isLocked = false;
                this._emitState();

                if (this.lives <= 0) {
                    this._gameOver();
                }
            }, 800);
        }
    }

    _levelComplete() {
        this.timer.stop();
        const timeBonus = this.timer.remaining * 10;
        this.score += timeBonus;
        this.isRunning = false;

        if (this.onLevelComplete) {
            this.onLevelComplete(this.level, this.score);
        }
    }

    /**
     * Advance to the next level.
     */
    nextLevel() {
        this.level++;
        this.lives = Math.min(this.lives + 1, LEVEL_CONFIG.maxLives); // Restore 1 life
        this._startLevel();
    }

    _gameOver() {
        this.timer.stop();
        this.isRunning = false;

        if (this.onGameOver) {
            this.onGameOver(this.score, this.level);
        }
    }

    /**
     * Pause / Resume
     */
    pause() {
        if (!this.isRunning) return;
        this.isPaused = true;
        this.timer.pause();
        this._emitState();
    }

    resume() {
        if (!this.isRunning) return;
        this.isPaused = false;
        this.timer.resume();
        this._emitState();
    }

    /**
     * Get pairs count for a level.
     */
    _getPairsForLevel(level) {
        const pairs = LEVEL_CONFIG.basePairs + (level - 1) * LEVEL_CONFIG.pairsPerLevel;
        return Math.min(pairs, LEVEL_CONFIG.maxPairs);
    }

    /**
     * Get time for a level.
     */
    _getTimeForLevel(level) {
        return LEVEL_CONFIG.baseTime + (level - 1) * LEVEL_CONFIG.timePerLevel;
    }

    /**
     * Get the optimal column count for the board based on card count.
     */
    getColumnCount() {
        const total = this.cards.length;
        if (total <= 12) return 4;
        if (total <= 20) return 5;
        if (total <= 30) return 5;
        if (total <= 42) return 6;
        return 6;
    }

    /**
     * Get serializable state for saving.
     */
    getSaveState() {
        return {
            level: this.level,
            score: this.score,
            lives: this.lives,
        };
    }

    _emitState() {
        if (this.onStateChange) {
            this.onStateChange({
                cards: this.cards,
                score: this.score,
                lives: this.lives,
                level: this.level,
                combo: this.combo,
                timeRemaining: this.timer.remaining,
                isPaused: this.isPaused,
                isRunning: this.isRunning,
            });
        }
    }
}
