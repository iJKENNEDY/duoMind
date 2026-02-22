/**
 * Board Component — Renders the card grid.
 */

import { createCard, updateCard } from './Card.js';

export function createBoard(cards, columns, onCardClick, shape = 'rectangle') {
    const board = document.createElement('div');
    board.className = 'board';
    board.setAttribute('data-cols', columns);
    board.setAttribute('data-shape', shape);
    board.id = 'game-board';

    cards.forEach((card, index) => {
        const cardEl = createCard(card, index, onCardClick);
        board.appendChild(cardEl);
    });

    return board;
}

export function updateBoard(cards) {
    cards.forEach((card, index) => {
        updateCard(index, card);
    });
}
