/**
 * GameScreen — Active 2D gameplay screen with Board + HUD + Pause overlay.
 * Supports different card shapes via the `shape` parameter.
 */

import { createBoard, updateBoard } from '../components/Board.js';
import { createHUD, updateHUD } from '../components/HUD.js';

export function createGameScreen({ engine, shape = 'rectangle', onPause, onQuit }) {
    const screen = document.createElement('div');
    screen.classList.add('screen-game');

    // HUD
    const hud = createHUD();
    screen.appendChild(hud);

    // Board
    const cols = engine.getColumnCount();
    const board = createBoard(engine.cards, cols, (index) => {
        engine.flipCard(index);
    }, shape);
    board.classList.add('preview'); // Disable clicks during preview
    screen.appendChild(board);

    // Pause overlay
    const pauseOverlay = document.createElement('div');
    pauseOverlay.className = 'overlay';
    pauseOverlay.id = 'pause-overlay';
    pauseOverlay.innerHTML = `
    <div class="modal">
      <h2>⏸️ Paused</h2>
      <p>Take a breather!</p>
      <div class="modal-actions">
        <button class="btn btn-primary" id="pause-resume">▶️ Resume</button>
        <button class="btn btn-secondary" id="pause-quit">🚪 Quit</button>
      </div>
    </div>
  `;
    screen.appendChild(pauseOverlay);

    // Level Complete overlay
    const levelOverlay = document.createElement('div');
    levelOverlay.className = 'overlay';
    levelOverlay.id = 'level-overlay';
    levelOverlay.innerHTML = `
    <div class="modal">
      <h2>🎉 Level Complete!</h2>
      <p id="level-complete-msg">Great job!</p>
      <div class="modal-actions">
        <button class="btn btn-primary btn-lg" id="next-level-btn">➡️ Next Level</button>
      </div>
    </div>
  `;
    screen.appendChild(levelOverlay);

    // Pause button handler
    const pauseBtn = screen.querySelector('#hud-pause');
    pauseBtn.addEventListener('click', () => {
        engine.pause();
        pauseOverlay.classList.add('active');
    });

    // Resume
    screen.querySelector('#pause-resume').addEventListener('click', () => {
        engine.resume();
        pauseOverlay.classList.remove('active');
    });

    // Quit
    screen.querySelector('#pause-quit').addEventListener('click', onQuit);

    // State change handler
    engine.onStateChange = (state) => {
        updateHUD(state);
        updateBoard(state.cards);
    };

    // Level complete handler
    engine.onLevelComplete = (level, score) => {
        const msg = screen.querySelector('#level-complete-msg');
        msg.textContent = `Level ${level} cleared! Score: ${score.toLocaleString()}`;
        levelOverlay.classList.add('active');
    };

    // Next level button
    screen.querySelector('#next-level-btn').addEventListener('click', () => {
        levelOverlay.classList.remove('active');

        // Re-render board for the new level
        engine.nextLevel();
        const oldBoard = screen.querySelector('#game-board');
        const newCols = engine.getColumnCount();
        const newBoard = createBoard(engine.cards, newCols, (index) => {
            engine.flipCard(index);
        }, shape);
        newBoard.classList.add('preview');
        oldBoard.replaceWith(newBoard);

        // Preview then start
        engine.startAfterPreview(() => {
            newBoard.classList.remove('preview');
        });
    });

    // Initial HUD update
    updateHUD({
        level: engine.level,
        score: engine.score,
        lives: engine.lives,
        timeRemaining: 0,
    });

    // Start with card preview
    setTimeout(() => {
        engine.startAfterPreview(() => {
            board.classList.remove('preview');
        });
    }, 300);

    return screen;
}
